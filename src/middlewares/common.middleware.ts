import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import mongoose from "mongoose";

import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";

class CommonMiddleware {
  public isUser(id: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const idUser = req.params[id];
        if (!mongoose.isObjectIdOrHexString(idUser)) {
          throw new ApiError("Not valid ID", 400);
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public isEmail() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.body;
        // Передаємо email як параметр до методу getOneByParams
        const existingEmail = await userRepository.getOneByParams({ email });

        if (existingEmail) {
          throw new ApiError("Email already exists", 409);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public runValidator(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = validator.validate(req.body);

        if (error) {
          throw new ApiError(error.message, 409);
        }

        req.body = value;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
