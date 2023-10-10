import { Document, Types } from "mongoose";

import { IUser } from "./user.type";

export interface ITokenPayload {
  _userId: Types.ObjectId;
  name?: string;
}

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenActivate {
  accessToken: string;
}

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  _userId: Types.ObjectId | IUser;
}
