"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenRepository = void 0;
const api_error_1 = require("../errors/api.error");
const Token_models_1 = require("../models/Token.models");
class TokenRepository {
    async create(tokens) {
        try {
            return await Token_models_1.Token.create(tokens);
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, 401);
        }
    }
    async findOne(params) {
        try {
            return await Token_models_1.Token.findOne(params);
        }
        catch (e) {
            throw new api_error_1.ApiError("error findOne", e.status);
        }
    }
    async deleteOne(params) {
        await Token_models_1.Token.deleteOne(params);
    }
    async deleteAll(params) {
        await Token_models_1.Token.deleteMany(params);
    }
}
exports.tokenRepository = new TokenRepository();
