"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const config_1 = require("../configs/config");
const email_action_enum_1 = require("../enums/email.action.enum");
const gender_enum_1 = require("../enums/gender.enum");
const api_error_1 = require("../errors/api.error");
const token_repository_1 = require("../repositories/token.repository");
const user_repository_1 = require("../repositories/user.repository");
const email_services_1 = require("./email.services");
const password_service_1 = require("./password.service");
const token_services_1 = require("./token.services");
class AuthService {
    async register(data) {
        const hashedPassword = await password_service_1.passwordService.hash(data.password);
        const user = await user_repository_1.userRepository.createUser({
            ...data,
            password: hashedPassword,
            status: gender_enum_1.EUserStatus.inactive,
        });
        const { accessToken } = token_services_1.tokenService.generateActivateToken({
            _userId: user._id,
        }, config_1.configs.JWT_ACTIVATE_SECRET);
        return await token_repository_1.tokenRepository.createActivateToken({
            token: accessToken,
            type: gender_enum_1.EActionTokenType.activate,
            _userId: user._id,
        });
    }
    async activate(payload) {
        try {
            const user = await user_repository_1.userRepository.getOneByParams({
                _id: payload._userId,
            });
            await email_services_1.emailService.sendMail(user.email, email_action_enum_1.EEmailAction.ACTIVATE, {
                name: user.name,
            });
            const user2 = await user_repository_1.userRepository.updateOneById(user.id, {
                status: gender_enum_1.EUserStatus.active,
            });
            return user2;
        }
        catch (e) {
            throw new api_error_1.ApiError("ActivateService", 401);
        }
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
    async logout(payload, accessToken) {
        try {
            return await token_repository_1.tokenRepository.deleteAll({ _userId: payload._userId });
            if (accessToken)
                return await token_repository_1.tokenRepository.deleteOne({ _userId: payload._userId });
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async forgot(user) {
        try {
            const { accessToken } = token_services_1.tokenService.generateActivateToken({
                _userId: user._id,
            }, config_1.configs.JWT_FORGOT_SECRET);
            const tokenForgot = await token_repository_1.tokenRepository.createActivateToken({
                token: accessToken,
                type: gender_enum_1.EActionTokenType.forgotPassword,
                _userId: user._id,
            });
            email_services_1.emailService.sendMail(user.email, email_action_enum_1.EEmailAction.FORGOT_PASSWORD, {
                accessToken,
            });
            return tokenForgot;
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async setForgotPassword(actionToken, newPassword, payload) {
        try {
            const entity = await token_repository_1.tokenRepository.findOneActionToken({
                token: actionToken,
            });
            if (!entity) {
                throw new api_error_1.ApiError("Not valid token", 400);
            }
            const newHashedPassword = await password_service_1.passwordService.hash(newPassword);
            await Promise.all([
                user_repository_1.userRepository.updateOneById(payload._userId, {
                    password: newHashedPassword,
                }),
                token_repository_1.tokenRepository.deleteOne({ token: actionToken }),
            ]);
            return "password update";
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
}
exports.authService = new AuthService();
