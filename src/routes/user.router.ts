/* eslint-disable prettier/prettier */
import { Router } from "express";

import { userController } from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.get("/", userController.getAll);
UserRouter.post("/", userController.createUser);
UserRouter.get("/:id", userController.getId);
UserRouter.delete("/:id", userController.deleteId);

export { UserRouter };
