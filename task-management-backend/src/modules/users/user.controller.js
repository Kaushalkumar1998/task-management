import * as userService from "./user.service.js";

export const registerUser = async (req, res) => {
  const user = await userService.createUser({
    ...req.body,
    actor: req.user,
  });

  return res.status(201).json({
    success: true,
    data: user,
  });
};

export const getUsers = async (req, res) => {
  const users = await userService.getUsers(req.user, req.query);

  return res.status(200).json({
    success: true,
    data: users,
  });
};

export const getTeamLeadTaskOverview = async (req, res) => {
  const overview = await userService.getTeamLeadTaskOverview(
    req.user,
    req.query,
  );

  return res.status(200).json({
    success: true,
    data: overview,
  });
};

export const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.user, req.params.userId, req.body);

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.user, req.params.userId);

  return res.status(200).json({
    success: true,
    data: result,
  });
};
