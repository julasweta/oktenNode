/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { configs } from "./configs/config"; //для .env
import { AuthRouter } from "./routes/auth.router";
import { UserRouter } from "./routes/user.router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRouter);
app.use("/auth", AuthRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.json(error.message);
});

const PORT = 5001;

app.listen(PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  console.log(`Server has successfully started on PORT ${PORT}`);
});
//twilio - для смс