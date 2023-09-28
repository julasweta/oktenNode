"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./configs/config");
const user_router_1 = __importDefault(require("./routes/user.router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.route("/users")
    .get(user_router_1.default)
    .post(user_router_1.default);
app.route("/users/:id")
    .get(user_router_1.default)
    .delete(user_router_1.default);
app.use((error, req, res, next) => {
    res.json(error.message);
});
const PORT = 5001;
app.listen(PORT, async () => {
    await mongoose_1.default.connect(config_1.configs.DB_URI);
    console.log(`Server has successfully started on PORT ${PORT}`);
});
