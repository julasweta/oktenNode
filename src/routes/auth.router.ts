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
AuthRouter.post("/login", authController.login);
AuthRouter.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

export { AuthRouter };
