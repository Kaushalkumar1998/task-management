import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { ROLES } from "../../shared/constants/enum.js";
import { MESSAGES } from "../../shared/constants/message.js";

export const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user) {
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );

  return {
    token,
    user: {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      teamLeadId: user.teamLeadId,
    },
  };
};

export const logout = async () => {
  return {
    message: MESSAGES.AUTH.LOGGED_OUT,
  };
};

export const registerUser = async ({
  username,
  email,
  password,
  firstName = "",
  lastName = "",
  role = ROLES.EMPLOYEE,
}) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username }],
  });

  if (existingUser) {
    throw new Error(MESSAGES.USER.DUPLICATE);
  }

  if (role !== ROLES.EMPLOYEE) {
    throw new Error(MESSAGES.AUTH.PUBLIC_EMPLOYEE_ONLY);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    firstName,
    lastName,
    email: normalizedEmail,
    password: hashedPassword,
    role: ROLES.EMPLOYEE,
    teamLeadId: null,
  });

  return {
    id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    teamLeadId: newUser.teamLeadId,
  };
};
