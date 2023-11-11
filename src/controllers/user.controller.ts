import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { userService } from "../services/user.service";
import { EFileTypes } from "../types/file.type";
import { IUser } from "../types/user.type";
import { userPresenter } from "../presenters/user.presenter";

// Controller  тільки вказує хто буде обробляти запит, а сам запит передає Services
// також тут передаються дані для запиту і відправляється тут response

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAll();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  public async getWithPagination(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAllWithPagination(req.query);
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const createdUser = await userService.createUser(req.body);
      res.status(201).json(createdUser);
    } catch (e) {
      next(e);
    }
  }

  public async getId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const { id } = req.params;
      const user = await userService.getId(id);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  public async deleteId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const { deletedCount } = await userService.deleteOne(id);
      if (deletedCount != 0) {
        res.status(201).json({
          message: "User deleted",
        });
      } else {
        throw new Error("user not found");
      }
    } catch (error) {
      next(error);
    }
  }
  public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    const avatar = req.files.avatar as UploadedFile;
    const { id } = req.params;
    const type = EFileTypes.User;
    const user = await userService.uploadAvatar(avatar, type, id);
    const response = userPresenter.present(user);
    return res.json(response);
  }
}

export const userController = new UserController();
