"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOldUser = void 0;
const cron_1 = require("cron");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const email_action_enum_1 = require("../enums/email.action.enum");
const api_error_1 = require("../errors/api.error");
const user_repository_1 = require("../repositories/user.repository");
const email_services_1 = require("../services/email.services");
dayjs_1.default.extend(utc_1.default);
const tokensRemover = async function () {
    try {
        const previousMonth = (0, dayjs_1.default)().utc().subtract(2, "d");
        const users = await user_repository_1.userRepository.getAllByParams({
            createdAt: { $lte: previousMonth }
        });
        const message = 'Ваш акаунт давно не використовувався. Будь ласка, увійдіть для активного використання.';
        await users.map((user) => {
            email_services_1.emailService.sendMail(user.email, email_action_enum_1.EEmailAction.REGISTER, {
                name: user.name,
                message: message
            });
        });
    }
    catch (e) {
        throw new api_error_1.ApiError(e.message, e.status);
    }
};
exports.sendOldUser = new cron_1.CronJob('0 0 */2 * * *', tokensRemover);
