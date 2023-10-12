"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const api_error_1 = require("../errors/api.error");
const User_model_1 = require("../models/User.model");
class UserRepository {
    async getAll() {
        const users = await User_model_1.User.find();
        return users;
    }
    async createUser(data) {
        try {
            console.log("createUserReposit", data);
            return await User_model_1.User.create(data);
        }
        catch (e) {
            throw new api_error_1.ApiError("userCreate error", 401);
        }
    }
    async updateOneById(userId, dto) {
        return await User_model_1.User.findByIdAndUpdate(userId, dto, {
            returnDocument: "after",
        });
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
    async getAllByParams(createdAt) {
        return await User_model_1.User.find(createdAt);
    }
}
exports.userRepository = new UserRepository();
