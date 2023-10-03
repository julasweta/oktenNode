"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const User_model_1 = require("../models/User.model");
const user_validator_1 = require("../validators/user.validator");
class UserController {
  async getAll(req, res, next) {
    try {
      const users = await User_model_1.User.find();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }
  async createUser(req, res, next) {
    try {
      const { error, value } = user_validator_1.UserValidator.create.validate(
        req.body,
      );
      if (error) {
        throw new Error(error.message);
      }
      const createdUser = await User_model_1.User.create(value);
      res.status(201).json(createdUser);
    } catch (e) {
      next(e);
    }
  }
}
exports.userController = new UserController();
