import { MESSAGES } from "../shared/constants/message.js";

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: MESSAGES.RBAC.ACCESS_DENIED,
            });
        }

        next();
    };
};

export default authorize;
