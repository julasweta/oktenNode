"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonMiddleware = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const api_error_1 = require("../errors/api.error");
const user_repository_1 = require("../repositories/user.repository");
class CommonMiddleware {
    isUser(id) {
        return async (req, res, next) => {
            try {
                const idUser = req.params[id];
                if (!mongoose_1.default.isObjectIdOrHexString(idUser)) {
                    throw new api_error_1.ApiError("Not valid ID", 400);
                }
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    isEmail() {
        return async (req, res, next) => {
            try {
                const { email } = req.body;
                const existingEmail = await user_repository_1.userRepository.getOneByParams({ email });
                if (existingEmail) {
                    throw new api_error_1.ApiError("Email already exists", 409);
                }
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    runValidator(validator) {
        return (req, res, next) => {
            try {
                const { error, value } = validator.validate(req.body);
                if (error) {
                    throw new api_error_1.ApiError(error.message, 400);
                }
                req.body = value;
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.commonMiddleware = new CommonMiddleware();
