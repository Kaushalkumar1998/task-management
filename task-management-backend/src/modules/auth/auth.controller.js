import * as authService from "./auth.service.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const data = await authService.login(email, password);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const registerUser = async (req, res) => {
  const user = await authService.registerUser(req.body);

  return res.status(201).json({
    success: true,
    data: user,
  });
};

export const logout = async (req, res) => {
  const data = await authService.logout();

  return res.status(200).json({
    success: true,
    data,
  });
};
