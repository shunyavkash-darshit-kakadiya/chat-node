import registerController from "../../controllers/v1/auth/register.controller.js";
import loginController from "../../controllers/v1/auth/login.controller.js";
import googleLoginController from "../../controllers/v1/auth/googleLogin.controller.js";
import logoutController from "../../controllers/v1/auth/logout.controller.js";
import generate2FA from "../../controllers/v1/auth/generate2FA.controller.js";
import verify2FA from "../../controllers/v1/auth/verify2FA.controller.js";
import getUserById from "../../controllers/v1/auth/getUserById.controller.js";
import getAllUsers from "../../controllers/v1/auth/getAllUser.controller.js";
import verifyLogin2FA from "../../controllers/v1/auth/verifyLogin2FA.js";
import AuthMiddleware from "../../../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google", googleLoginController);
router.post("/logout", logoutController);
router.post("/2fa/enable", AuthMiddleware, generate2FA);
router.post("/2fa/verify", AuthMiddleware, verify2FA);
router.post("/2fa/login/verify", verifyLogin2FA);
router.get("/sync", AuthMiddleware, getUserById);
router.get("/users", AuthMiddleware, getAllUsers);

export default router;
