import { Document, Types } from "mongoose";

import { EActionTokenType } from "../enums/gender.enum";
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

export interface IActionTokenDocument extends Document {
  token: string;
  type: EActionTokenType;
  _userId: Types.ObjectId | IUser;
}

export interface IActionToken
  extends Pick<IActionTokenDocument, "token" | "type" | "_userId"> {}
