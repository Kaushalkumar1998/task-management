import jwt from "jsonwebtoken";
import User from "../modules/users/user.model.js";
import { MESSAGES } from "../shared/constants/message.js";

const authMiddleware = async (req, res, next) => {
  const [scheme, token] = req.headers.authorization?.split(" ") || [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: MESSAGES.AUTH.TOKEN_REQUIRED,
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId).select(
      "_id username email role teamLeadId",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.AUTH.USER_NOT_FOUND,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: MESSAGES.AUTH.INVALID_TOKEN,
    });
  }
};

export default authMiddleware;
