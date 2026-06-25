import { getIO } from "../../config/socket.js";
import { ROLES } from "../../shared/constants/enum.js";
import { MESSAGES } from "../../shared/constants/message.js";
import { getPagination, getPaginationMeta } from "../../utils/pagination.js";
import User from "../users/user.model.js";
import Task from "./task.model.js";

const sameId = (left, right) => String(left) === String(right);
const populateUsers = "createdBy assignedTo";
const userFields = "username email role";

const emitTaskEvent = (event, payload) => {
  try {
    getIO().emit(event, payload);
  } catch (_error) {
    // Socket.IO is optional for API correctness.
  }
};

const getAllowedUserIds = async (actor) => {
  if (actor.role === ROLES.MANAGER) {
    return null; // manager can access all users/tasks
  }

  if (actor.role === ROLES.TEAM_LEAD) {
    const members = await User.find({ teamLeadId: actor._id }).select("_id").lean();
    return [actor._id, ...members.map((member) => member._id)];
  }

  return [actor._id];
};

const getAssigneeId = async (actor, assignedTo) => {
  if (actor.role === ROLES.EMPLOYEE) {
    if (assignedTo && !sameId(assignedTo, actor._id)) {
      throw new Error(MESSAGES.TASK.EMPLOYEE_ASSIGN_SELF_ONLY);
    }

    return actor._id;
  }

  if (!assignedTo) {
    return actor._id;
  }

  const allowedUserIds = await getAllowedUserIds(actor);
  const assignee = await User.findById(assignedTo).select("_id role teamLeadId");

  if (!assignee) {
    throw new Error(MESSAGES.TASK.ASSIGNEE_NOT_FOUND);
  }

  if (actor.role === ROLES.MANAGER) {
    return assignee._id;
  }

  const canAssign = allowedUserIds.some((userId) => sameId(userId, assignee._id));
  if (!canAssign) {
    throw new Error(MESSAGES.TASK.TEAM_LEAD_ASSIGN_SCOPE);
  }

  return assignee._id;
};

const getTaskQuery = (allowedUserIds, filters = {}) => {
  const query = {};

  if (allowedUserIds) {
    query.assignedTo = { $in: allowedUserIds };
  }

  if (filters.status) query.status = filters.status;
  if (filters.assignedTo) {
    const canFilterByAssignee =
      !allowedUserIds || allowedUserIds.some((userId) => sameId(userId, filters.assignedTo));

    query.assignedTo = canFilterByAssignee ? filters.assignedTo : null;
  }
  if (filters.createdBy) query.createdBy = filters.createdBy;

  return query;
};

export const createTask = async (actor, payload) => {
  const assignedTo = await getAssigneeId(actor, payload.assignedTo);

  const task = await Task.create({
    title: payload.title,
    description: payload.description || "",
    status: payload.status,
    createdBy: actor._id,
    assignedTo,
  });

  const populatedTask = await Task.findById(task._id)
    .populate(populateUsers, userFields)
    .lean();

  emitTaskEvent("task:created", populatedTask);
  return populatedTask;
};

export const getTasks = async (actor, filters = {}) => {
  const pagination = getPagination(filters);
  const allowedUserIds = await getAllowedUserIds(actor);
  const query = getTaskQuery(allowedUserIds, filters);

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate(populateUsers, userFields)
      .sort({ updatedAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Task.countDocuments(query),
  ]);

  return {
    items: tasks,
    pagination: getPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
};

export const updateTask = async (actor, taskId, payload) => {
  const allowedUserIds = await getAllowedUserIds(actor);
  const task = await Task.findOne({
    _id: taskId,
    ...getTaskQuery(allowedUserIds),
  });

  if (!task) {
    throw new Error(MESSAGES.TASK.NOT_FOUND_OR_DENIED);
  }

  if (payload.assignedTo !== undefined) {
    task.assignedTo = await getAssigneeId(actor, payload.assignedTo);
  }

  ["title", "description", "status"].forEach((field) => {
    if (payload[field] !== undefined) {
      task[field] = payload[field];
    }
  });

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate(populateUsers, userFields)
    .lean();

  emitTaskEvent("task:updated", populatedTask);
  return populatedTask;
};

export const deleteTask = async (actor, taskId) => {
  if (actor.role !== ROLES.MANAGER) {
    throw new Error(MESSAGES.TASK.DELETE_MANAGER_ONLY);
  }

  const task = await Task.findOne({
    _id: taskId,
  });

  if (!task) {
    throw new Error(MESSAGES.TASK.NOT_FOUND_OR_DENIED);
  }

  await task.deleteOne();

  emitTaskEvent("task:deleted", { taskId });
  return { taskId };
};
