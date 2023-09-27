import express from "express";
import mongoose from "mongoose";
import {configs} from "./configs/config";
import {User} from "./models/User.model";

const app = express();
app.use(express.json()); // Виправлено: виклик функції express.json()
app.use(express.urlencoded({extended: true}));

const ObjectId = mongoose.Types.ObjectId;




app.get("/users", async (req: any, res: any) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        res.status(500).json({error: "Помилка при отриманні користувачів"});
    }
});


app.post("/users", async (req: any, res: any) => {
    try {
        const createdUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
        });
        res.status(201).json(createdUser);
    } catch (e) {
        res.status(400).json(e.message);
    }
});
//const users = fsServices.readerFile();

const PORT = 5001;

app.listen(PORT, async () => {
    await mongoose.connect(configs.DB_URI);
    console.log(`Server has successfully started on PORT ${PORT}`);
});
