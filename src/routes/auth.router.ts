/* eslint-disable prettier/prettier */
import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";

const AuthRouter = Router();

AuthRouter.post(
  "/register",
  commonMiddleware.isEmail(),
  authController.register,
);

AuthRouter.post(
  "/activate",
  authMiddleware.checkAtivateToken,
  authController.activate,
);

AuthRouter.post(
  "/login",
  authMiddleware.checkStatus("email"),
  authController.login,
);

AuthRouter.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

AuthRouter.post(
  "/logout",
  authMiddleware.checkAccessToken,
  authController.logout,
);

AuthRouter.post(
  "/forgot",
  authMiddleware.checkUser("email"),
  authController.forgot,
);

AuthRouter.put(
  "/forgot/:token",
  authMiddleware.checkForgotToken,
  authController.setForgotPassword,
);

export { AuthRouter };
