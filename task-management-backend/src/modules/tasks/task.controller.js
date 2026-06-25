import * as taskService from "./task.service.js";

export const createTask = async (req, res) => {
  const task = await taskService.createTask(req.user, req.body);

  return res.status(201).json({
    success: true,
    data: task,
  });
};

export const getTasks = async (req, res) => {
  const tasks = await taskService.getTasks(req.user, req.query);

  return res.status(200).json({
    success: true,
    data: tasks,
  });
};

export const updateTask = async (req, res) => {
  const task = await taskService.updateTask(
    req.user,
    req.params.taskId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    data: task,
  });
};

export const deleteTask = async (req, res) => {
  const result = await taskService.deleteTask(req.user, req.params.taskId);

  return res.status(200).json({
    success: true,
    data: result,
  });
};
