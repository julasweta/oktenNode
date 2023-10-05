"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const email_action_enum_1 = require("../enums/email.action.enum");
const email_services_1 = require("../services/email.services");
const user_service_1 = require("../services/user.service");
class UserController {
    async getAll(req, res, next) {
        try {
            await email_services_1.emailService.sendMail("julasweta@ukr.net", email_action_enum_1.EEmailAction.REGISTER, {
                name: "stugarka",
            });
            const users = await user_service_1.userService.getAll();
            return res.json(users);
        }
        catch (error) {
            next(error);
        }
    }
    async createUser(req, res, next) {
        try {
            const createdUser = await user_service_1.userService.createUser(req.body);
            res.status(201).json(createdUser);
        }
        catch (e) {
            next(e);
        }
    }
    async getId(req, res, next) {
        try {
            const { id } = req.params;
            const user = await user_service_1.userService.getId(id);
            return res.json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteId(req, res, next) {
        const { id } = req.params;
        try {
            const { deletedCount } = await user_service_1.userService.deleteOne(id);
            if (deletedCount != 0) {
                res.status(201).json({
                    message: "User deleted",
                });
            }
            else {
                throw new Error("user not found");
            }
        }
        catch (error) {
            next(error);
        }
    }
}
exports.userController = new UserController();
