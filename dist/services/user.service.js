"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_repository_1 = require("../repositories/user.repository");
class UserService {
    async getAll() {
        return await user_repository_1.userRepository.getAll();
    }
    async createUser(data) {
        return await user_repository_1.userRepository.createUser(data);
    }
    async getId(id) {
        return await user_repository_1.userRepository.getId(id);
    }
    deleteOne(id) {
        return user_repository_1.userRepository.deleteOne(id);
    }
}
exports.userService = new UserService();
