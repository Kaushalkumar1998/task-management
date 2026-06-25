import mongoose from "mongoose";
import seedManager from "../seeders/manager.seeder.js";
import { MESSAGES } from "../shared/constants/message.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(MESSAGES.DATABASE.CONNECTED);
    await seedManager()
  } catch (error) {
    console.error(MESSAGES.DATABASE.CONNECTION_ERROR, error);
    process.exit(1);
  }
};

export default connectDB;
