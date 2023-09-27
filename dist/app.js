"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./configs/config");
const User_model_1 = require("./models/User.model");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const ObjectId = mongoose_1.default.Types.ObjectId;
app.get("/users", async (req, res) => {
    try {
        const users = await User_model_1.User.find();
        return res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Помилка при отриманні користувачів" });
    }
});
app.post("/users", async (req, res) => {
    try {
        const createdUser = await User_model_1.User.create({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
        });
        res.status(201).json(createdUser);
    }
    catch (e) {
        res.status(400).json(e.message);
    }
});
const PORT = 5001;
app.listen(PORT, async () => {
    await mongoose_1.default.connect(config_1.configs.DB_URI);
    console.log(`Server has successfully started on PORT ${PORT}`);
});
