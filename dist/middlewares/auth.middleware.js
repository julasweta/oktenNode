"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const gender_enum_1 = require("../enums/gender.enum");
const api_error_1 = require("../errors/api.error");
const User_model_1 = require("../models/User.model");
const token_repository_1 = require("../repositories/token.repository");
const token_services_1 = require("../services/token.services");
class AuthMiddleware {
    async checkAccessToken(req, res, next) {
        try {
            const accessToken = req.get("Authorization");
            if (!accessToken) {
                throw new api_error_1.ApiError("No Token!", 401);
            }
            const payload = token_services_1.tokenService.checkToken(accessToken, "access");
            const entity = await token_repository_1.tokenRepository.findOne({ accessToken });
            if (!entity) {
                throw new api_error_1.ApiError("Token not valid!", 401);
            }
            req.res.locals.tokenPayload = payload;
            req.res.locals.accessToken = accessToken;
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async checkAtivateToken(req, res, next) {
        try {
            const accessToken = req.get("Authorization");
            if (!accessToken) {
                throw new api_error_1.ApiError("No Token!", 401);
            }
            const payload = token_services_1.tokenService.checkToken(accessToken, "activate");
            const entity = await token_repository_1.tokenRepository.findOne({ accessToken });
            if (!entity) {
                throw new api_error_1.ApiError("Token not valid!", 401);
            }
            req.res.locals.tokenPayload = payload;
            req.res.locals.accessToken = accessToken;
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async checkRefreshToken(req, res, next) {
        try {
            const refreshToken = req.get("Authorization");
            if (!refreshToken) {
                throw new api_error_1.ApiError("No Token!", 401);
            }
            const payload = token_services_1.tokenService.checkToken(refreshToken, "refresh");
            const entity = await token_repository_1.tokenRepository.findOne({ refreshToken });
            if (!entity) {
                throw new api_error_1.ApiError("Token not valid!", 401);
            }
            req.res.locals.tokenPayload = payload;
            req.res.locals.refreshToken = refreshToken;
            next();
        }
        catch (e) {
            next(e);
        }
    }
    checkUser(field) {
        return async (req, res, next) => {
            try {
                const user = await User_model_1.User.findOne({ [field]: req.body[field] }).lean();
                if (!user) {
                    throw new api_error_1.ApiError("User not found", 404);
                }
                req.res.locals.user = user;
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    checkStatus(field) {
        return async (req, res, next) => {
            try {
                const user = await User_model_1.User.findOne({ [field]: req.body[field] }).lean();
                if (user.status !== gender_enum_1.EUserStatus.active) {
                    throw new api_error_1.ApiError("User not activate", 404);
                }
                req.res.locals.user = user;
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.authMiddleware = new AuthMiddleware();
