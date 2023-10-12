/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import * as swaggerUi from "swagger-ui-express";

import { configs } from "./configs/config"; //для .env
import { cronRunner } from "./crons";
import { AuthRouter } from "./routes/auth.router";
import { UserRouter } from "./routes/user.router";
import * as swaggerJson from "./utils/swagger.json";
// щоб підтягувався utils/json d tsconfig додати -    "resolveJsonModule": true

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRouter);
app.use("/auth", AuthRouter);

const options = {
  explorer: true
};
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson, options));

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.json(error.message);
});

const PORT = 5001;

app.listen(PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  cronRunner();
  console.log(`Server has successfully started on PORT ${PORT}`);
});
//twilio - для смс