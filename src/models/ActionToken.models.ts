import { model, Schema, Types } from "mongoose";

import { EActionTokenType } from "../enums/gender.enum";
import { IActionToken } from "../types/token.type";
import { User } from "./User.model";

const tokensSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: EActionTokenType,
      required: true,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  { timestamps: true, versionKey: false },
);

export const ActionToken = model<IActionToken>("action-token", tokensSchema);
