"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const api_error_1 = require("../errors/api.error");
const token_repository_1 = require("../repositories/token.repository");
const user_repository_1 = require("../repositories/user.repository");
const password_service_1 = require("./password.service");
const token_services_1 = require("./token.services");
class AuthService {
    async register(data) {
        const hashedPassword = await password_service_1.passwordService.hash(data.password);
        return await user_repository_1.userRepository.createUser({
            ...data,
            password: hashedPassword,
        });
    }
    async login(data) {
        const user = await user_repository_1.userRepository.getOneByParams({ email: data.email });
        if (!user) {
            throw new api_error_1.ApiError("Invalid user2", 401);
        }
        const checkPassword = await password_service_1.passwordService.compare(data.password, user.password);
        if (!checkPassword) {
            throw new api_error_1.ApiError("Invalid password", 401);
        }
        try {
            const tokens = token_services_1.tokenService.generateTokenPair({
                _userId: user._id,
                name: user.name,
            });
            return await token_repository_1.tokenRepository.create({ ...tokens, _userId: user._id });
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async refresh(payload, refreshToken) {
        try {
            const tokensPair = token_services_1.tokenService.generateTokenPair({
                _userId: payload._userId,
                name: payload.name,
            });
            await Promise.all([
                token_repository_1.tokenRepository.create({ ...tokensPair, _userId: payload._userId }),
                token_repository_1.tokenRepository.deleteOne({ refreshToken }),
            ]);
            return tokensPair;
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
}
exports.authService = new AuthService();
