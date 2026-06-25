import bcrypt from "bcryptjs";
import User from "../modules/users/user.model.js";
import { ROLES } from "../shared/constants/enum.js";
import { MESSAGES } from "../shared/constants/message.js";

const seedManager = async () => {
  try {
    const existingManager = await User.findOne({
      role: ROLES.MANAGER,
    });

    if (existingManager) {
      console.log(MESSAGES.USER.DEFAULT_MANAGER_EXISTS);
      return;
    }

    const hashedPassword = await bcrypt.hash("admin@123", 10);

    await User.create({
      firstName: "Kaushal",
      lastName: "Kumar",
      username: "kaushal",
      email: "kaushal@gmail.com",
      password: hashedPassword,
      role: ROLES.MANAGER,
    });

    console.log(MESSAGES.USER.DEFAULT_MANAGER_CREATED);
  } catch (error) {
    console.error(MESSAGES.USER.DEFAULT_MANAGER_SEED_ERROR, error);
  }
};

export default seedManager;
