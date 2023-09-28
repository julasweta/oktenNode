"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_model_1 = require("../models/User.model");
const user_validator_1 = require("../validators/user.validator");
async function isUser(id) {
    const errors = [];
    const users = await User_model_1.User.find();
    if (users.length > 0) {
        const newArr = users.filter((user) => {
            user.id === +id;
        });
        if (newArr.length > 0) {
            return true;
        }
        else {
            errors.push({ errorUser: "Юзера не знайдено" });
            return false;
        }
    }
}
const UserRouter = (0, express_1.Router)();
const getRouter = async (req, res, next) => {
    try {
        const users = await User_model_1.User.find();
        return res.json(users);
    }
    catch (error) {
        next(error);
    }
};
const postRouter = async (req, res, next) => {
    try {
        const { error, value } = user_validator_1.UserValidator.create.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }
        const createdUser = await User_model_1.User.create(value);
        res.status(201).json(createdUser);
    }
    catch (e) {
        next(e);
    }
};
const getIdRouter = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User_model_1.User.findById(id);
        return res.json(user);
    }
    catch (error) {
        next(error);
    }
};
const deleteIdRouter = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (isUser(+id)) {
            const { deletedCount } = await User_model_1.User.deleteOne({ _id: id });
            if (deletedCount != 0) {
                res.status(201).json({
                    message: "User deleted",
                });
            }
            else {
                throw new Error("user not found");
            }
        }
    }
    catch (error) {
        next(error);
    }
};
UserRouter.get("/users", getRouter);
UserRouter.post("/users", postRouter);
UserRouter.get("/users/:id", getIdRouter);
UserRouter.delete("/users/:id", deleteIdRouter);
exports.default = UserRouter;
