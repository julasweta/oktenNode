import { Document } from "mongoose";

import { EGenders, EUserStatus } from "../enums/gender.enum";

//наслідування інтерфейсу  від Document використовуються для опису моделей MongoDB
export interface IUser extends Document {
  name?: string;
  age?: number;
  genders?: EGenders;
  email: string;
  password: string;
  status: EUserStatus;
}

export type IUserCredentials = Pick<IUser, "email" | "password">;
