"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async register(req, res, next) {
        try {
            const accessToken = await auth_service_1.authService.register(req.body);
            return res.status(201).json(accessToken);
        }
        catch (error) {
            next(error);
        }
    }
    async activate(req, res, next) {
        try {
            const user = req.res.locals.user;
            const result = await auth_service_1.authService.activate(user);
            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const tokens = await auth_service_1.authService.login(req.body);
            res.status(201).json(tokens);
        }
        catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const tokenPayload = req.res.locals.tokenPayload;
            const refreshToken = req.res.locals.refreshToken;
            const tokensPair = await auth_service_1.authService.refresh(tokenPayload, refreshToken);
            return res.status(201).json(tokensPair);
        }
        catch (e) {
            next(e);
        }
    }
    async logout(req, res, next) {
        try {
            const tokenPayload = req.res.locals.tokenPayload;
            const accessToken = req.res.locals.accessToken;
            const result = await auth_service_1.authService.logout(tokenPayload, accessToken);
            console.log(result);
            res.status(201).json(result);
        }
        catch (e) {
            next(e);
        }
    }
    async forgot(req, res, next) {
        try {
            const user = req.res.locals.user;
            await auth_service_1.authService.forgot(user);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.authController = new AuthController();
