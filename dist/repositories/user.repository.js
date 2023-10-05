"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const User_model_1 = require("../models/User.model");
class UserRepository {
    async getAll() {
        const users = await User_model_1.User.find();
        return users;
    }
    async createUser(data) {
        return await User_model_1.User.create(data);
    }
    async getId(id) {
        return await User_model_1.User.findById(id);
    }
    async deleteOne(id) {
        return await User_model_1.User.deleteOne({ _id: id });
    }
    async getOneByParams(email) {
        return await User_model_1.User.findOne(email);
    }
}
exports.userRepository = new UserRepository();
