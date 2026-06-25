import User from "./user.model.js";
import bcrypt from "bcryptjs";
import { ROLES } from "../../shared/constants/enum.js";
import { MESSAGES } from "../../shared/constants/message.js";
import { getPagination, getPaginationMeta } from "../../utils/pagination.js";
import Task from "../tasks/task.model.js";

export const createUser = async ({
  actor,
  username,
  firstName,
  lastName,
  email,
  password,
  role,
  teamLeadId,
}) => {
  const requestedRole = role || ROLES.EMPLOYEE;

  if (actor.role === ROLES.TEAM_LEAD && requestedRole !== ROLES.EMPLOYEE) {
    throw new Error(MESSAGES.USER.TEAM_LEAD_CREATE_EMPLOYEE_ONLY);
  }

  if (actor.role !== ROLES.MANAGER && actor.role !== ROLES.TEAM_LEAD) {
    throw new Error(MESSAGES.USER.CREATE_ALLOWED_FOR_MANAGER_OR_TEAM_LEAD);
  }

  const normalizedEmail = email.toLowerCase();
  const isUserExist = await User.findOne({
    $or: [{ email: normalizedEmail }, { username }],
  });

  if (isUserExist) {
    throw new Error(MESSAGES.USER.DUPLICATE);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const resolvedTeamLeadId =
    actor.role === ROLES.TEAM_LEAD
      ? actor._id
      : requestedRole === ROLES.EMPLOYEE
        ? teamLeadId || null
        : null;

  if (resolvedTeamLeadId) {
    const teamLead = await User.findOne({
      _id: resolvedTeamLeadId,
      role: ROLES.TEAM_LEAD,
    });

    if (!teamLead) {
      throw new Error(MESSAGES.USER.TEAM_LEAD_NOT_FOUND);
    }
  }

  const user = await User.create({
    username,
    firstName,
    lastName,
    email: normalizedEmail,
    password: hashPassword,
    role: requestedRole,
    teamLeadId: resolvedTeamLeadId,
  });

  return user.toJSON();
};

export const getUsers = async (actor, filters = {}) => {
  const pagination = getPagination(filters);
  let query = {};

  if (actor.role === ROLES.MANAGER) {
    query = {};
  } else if (actor.role === ROLES.TEAM_LEAD) {
    query = {
      $or: [{ _id: actor._id }, { teamLeadId: actor._id }],
    };
  } else {
    query = { _id: actor._id };
  }

  if (filters.role) {
    query = { $and: [query, { role: filters.role }] };
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ role: 1, username: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    items: users,
    pagination: getPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
};

export const getTeamLeadTaskOverview = async (actor, filters = {}) => {
  if (actor.role !== ROLES.MANAGER) {
    throw new Error(MESSAGES.USER.MANAGER_TEAM_OVERVIEW_ONLY);
  }

  const pagination = getPagination(filters);
  const teamLeadQuery = { role: ROLES.TEAM_LEAD };
  const [teamLeads, total] = await Promise.all([
    User.find(teamLeadQuery)
      .select("-password")
      .sort({ username: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    User.countDocuments(teamLeadQuery),
  ]);

  const items = await Promise.all(
    teamLeads.map(async (teamLead) => {
      const members = await User.find({ teamLeadId: teamLead._id })
        .select("_id username email role")
        .sort({ username: 1 })
        .lean();
      const userIds = [teamLead._id, ...members.map((member) => member._id)];
      const tasks = await Task.find({
        $or: [
          { createdBy: { $in: userIds } },
          { assignedTo: { $in: userIds } },
        ],
      })
        .populate("createdBy", "username email role")
        .populate("assignedTo", "username email role")
        .sort({ updatedAt: -1 })
        .lean();

      return {
        teamLead,
        members,
        tasks,
      };
    }),
  );

  return {
    items,
    pagination: getPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
  };
};

export const updateUser = async (actor, userId, payload) => {
  const targetUser = await User.findById(userId).select("_id role teamLeadId");

  if (!targetUser) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  const isSelf = String(actor._id) === String(targetUser._id);
  const isTeamMember = String(targetUser.teamLeadId) === String(actor._id);
  const canUpdate =
    (actor.role === ROLES.MANAGER && targetUser.role !== ROLES.MANAGER) ||
    (actor.role === ROLES.TEAM_LEAD && targetUser.role === ROLES.EMPLOYEE && isTeamMember) ||
    (actor.role === ROLES.EMPLOYEE && isSelf);

  if (!canUpdate) {
    throw new Error(MESSAGES.USER.UPDATE_NOT_ALLOWED);
  }

  const allowedUpdates = {};
  ["firstName", "lastName", "username", "email"].forEach(
    (field) => {
      if (payload[field] !== undefined) {
        allowedUpdates[field] = payload[field];
      }
    },
  );

  if (actor.role === ROLES.MANAGER) {
    ["role", "teamLeadId"].forEach((field) => {
      if (payload[field] !== undefined) {
        allowedUpdates[field] = payload[field];
      }
    });
  }

  if (allowedUpdates.email) {
    allowedUpdates.email = allowedUpdates.email.toLowerCase();
  }

  if (allowedUpdates.role && allowedUpdates.role !== ROLES.EMPLOYEE) {
    allowedUpdates.teamLeadId = null;
  }

  if (allowedUpdates.teamLeadId) {
    const teamLead = await User.findOne({
      _id: allowedUpdates.teamLeadId,
      role: ROLES.TEAM_LEAD,
    });

    if (!teamLead) {
      throw new Error(MESSAGES.USER.TEAM_LEAD_NOT_FOUND);
    }
  }

  const user = await User.findByIdAndUpdate(userId, allowedUpdates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return user;
};

export const deleteUser = async (actor, userId) => {
  if (actor.role !== ROLES.MANAGER) {
    throw new Error(MESSAGES.USER.DELETE_MANAGER_ONLY);
  }

  const user = await User.findById(userId).select("_id role");

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  if (user.role === ROLES.MANAGER) {
    throw new Error(MESSAGES.USER.DELETE_NOT_ALLOWED);
  }

  await user.deleteOne();

  return { userId };
};
