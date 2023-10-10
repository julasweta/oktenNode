"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
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
        const { accessToken } = token_services_1.tokenService.generateActivateToken({
            _userId: data.id,
            name: data.name,
        });
        await email_services_1.emailService.sendMail(data.email, email_action_enum_1.EEmailAction.REGISTER, {
            name: data.name,
            activаteToken: accessToken,
        });
        await user_repository_1.userRepository.createUser({
            ...data,
            password: hashedPassword,
            status: gender_enum_1.EUserStatus.inactive,
        });
        return { accessToken };
    }
    async activate(data) {
        await email_services_1.emailService.sendMail(data.email, email_action_enum_1.EEmailAction.REGISTER, {
            name: data.name,
        });
        return await user_repository_1.userRepository.updateOneById(data._id, {
            ...data,
            status: gender_enum_1.EUserStatus.active,
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
            const tokens = token_services_1.tokenService.generateTokenPair({
                _userId: user._id,
            });
            const access = tokens.accessToken;
            console.log(access);
            email_services_1.emailService.sendMail(user.email, email_action_enum_1.EEmailAction.FORGOT_PASSWORD, {
                name: "forgot you",
            });
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
}
exports.authService = new AuthService();
