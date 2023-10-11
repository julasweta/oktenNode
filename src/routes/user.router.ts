/* eslint-disable prettier/prettier */
import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const UserRouter = Router();

UserRouter.get("/", authMiddleware.checkAccessToken, userController.getAll);
UserRouter.post(
  "/",
  commonMiddleware.isEmail(),
  commonMiddleware.runValidator(UserValidator.create),
  userController.createUser,
);
UserRouter.get("/:id", commonMiddleware.isUser("id"), userController.getId);
UserRouter.delete(
  "/:id",
  commonMiddleware.isUser("id"),
  userController.deleteId,
);

export { UserRouter };
