"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templates = void 0;
const email_action_enum_1 = require("../enums/email.action.enum");
exports.templates = {
    [email_action_enum_1.EEmailAction.REGISTER]: {
        templateName: "register",
        subject: "Hello, great to see you in our app",
    },
    [email_action_enum_1.EEmailAction.FORGOT_PASSWORD]: {
        templateName: "forgot-password",
        subject: "Do not worry, we control your password",
    },
};
