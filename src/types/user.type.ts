import { Document } from "mongoose";
import {EGenders} from "../enums/gender,enum";

//наслідування інтерфейсу  від Document використовуються для опису моделей MongoDB
export interface IUser extends Document {
  name?: string;
  age?: number;
  genders?: EGenders;
  email: string;
  password: string;
}
