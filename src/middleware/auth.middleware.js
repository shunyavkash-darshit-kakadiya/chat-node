import { verifyToken } from "../utils/token.util.js";
import { APP_JWT_SECRET } from "../configs/environment.config.js";
import { getActiveDevice } from "../services/activeDevices/activeDevice.service.js";
import Auth from "../models/auth.model.js";

const AuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    // console.log("AuthMiddleware Token===>", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        data: { forceLogout: true },
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token, APP_JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Session expired",
        data: { forceLogout: true },
      });
    }

    const user = await Auth.findById(decoded._id);

    //two factor authentication check
    if (user.twoFactorEnabled) {
      const visitorId = req.headers["x-visitor-id"];

      if (!visitorId) {
        return res.status(401).json({
          success: false,
          message: "Visitor ID required for 2FA",
          data: { forceLogout: true },
        });
      }

      const activeDevice = await getActiveDevice(decoded._id, visitorId);

      if (!activeDevice) {
        return res.status(401).json({
          success: false,
          message: "2FA verification required",
          data: { forceLogout: true },
        });
      }
    }

    req.user = {
      _id: decoded._id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("AuthMiddleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      data: { forceLogout: true },
    });
  }
};

export default AuthMiddleware;
