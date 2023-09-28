/* eslint-disable prettier/prettier */
import {NextFunction, Request, Response, Router} from "express";

import {User} from "../models/User.model";
import { IUser } from '../types/user.type';
import {UserValidator} from "../validators/user.validator";

async function isUser(id: any) {
  const errors = [];
  const users = await User.find();
  if (users.length > 0) {
    const newArr = users.filter((user:any) => {
      user.id === +id;
    });
    if (newArr.length > 0) {
      return true;
    } else {
      errors.push({errorUser: "Юзера не знайдено"});
      return false;
    }
  }
}

const UserRouter = Router();

const getRouter = async (req: Request, res: Response, next: NextFunction): Promise<Response<IUser[]>> => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    next(error); 
  }
};
const postRouter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {error, value} = UserValidator.create.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const createdUser = await User.create(value);
    res.status(201).json(createdUser);
  } catch (e) {
    next(e);
  }
}

const getIdRouter = async (req: Request, res: Response, next: NextFunction): Promise<Response<IUser[]>> => {
  const {id} = req.params;
    try {
      const user = await User.findById(id);
      return res.json(user);
    } catch (error) {
      next(error);
    }
}
  
const deleteIdRouter = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  try {
    if (isUser(+id)) {
      const {deletedCount} = await User.deleteOne({_id: id});
      if (deletedCount != 0) {
        res.status(201).json({
          message: "User deleted",
        });
      } else {
        throw new Error("user not found");
      }
    }
  } catch (error) {
    next(error);
  }
};

UserRouter.get("/users", getRouter);
UserRouter.post("/users", postRouter);
UserRouter.get("/users/:id", getIdRouter);
UserRouter.delete("/users/:id", deleteIdRouter);

export default UserRouter;