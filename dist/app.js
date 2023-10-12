"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swaggerUi = __importStar(require("swagger-ui-express"));
const config_1 = require("./configs/config");
const crons_1 = require("./crons");
const auth_router_1 = require("./routes/auth.router");
const user_router_1 = require("./routes/user.router");
const swaggerJson = __importStar(require("./utils/swagger.json"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/users", user_router_1.UserRouter);
app.use("/auth", auth_router_1.AuthRouter);
const options = {
    explorer: true
};
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson, options));
app.use((error, req, res, next) => {
    res.json(error.message);
});
const PORT = 5001;
app.listen(PORT, async () => {
    await mongoose_1.default.connect(config_1.configs.DB_URI);
    (0, crons_1.cronRunner)();
    console.log(`Server has successfully started on PORT ${PORT}`);
});
