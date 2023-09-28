/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import express, {NextFunction, Request, Response} from "express";
import mongoose from "mongoose";

import {configs} from "./configs/config";
import UserRouter from "./routes/user.router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//перевірка на наявність юзера
app.route("/users")
  .get(UserRouter)
  .post(UserRouter)

app.route("/users/:id")
  .get(UserRouter)
  .delete(UserRouter)

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.json(error.message);
});

const PORT = 5001;

app.listen(PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  console.log(`Server has successfully started on PORT ${PORT}`);
});