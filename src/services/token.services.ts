import * as jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { ApiError } from "../errors/api.error";
import {
  ITokenActivate,
  ITokenPayload,
  ITokensPair,
} from "../types/token.type";

class TokenService {
  //працює як функціїї які генерують токени і перевіряють токени
  public generateTokenPair(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: "30s",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  public generateActivateToken(payload: ITokenPayload): ITokenActivate {
    const accessToken = jwt.sign(payload, configs.JWT_ACTIVATE_SECRET, {
      expiresIn: "1d",
    });
    return {
      accessToken,
    };
  }

  public checkToken(
    token: string,
    type: "access" | "refresh" | "activate",
  ): ITokenPayload {
    try {
      let secret: string;
      switch (type) {
        case "access":
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case "refresh":
          secret = configs.JWT_REFRESH_SECRET;
          break;
        case "activate":
          secret = configs.JWT_ACTIVATE_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid!", 401);
    }
  }
}

export const tokenService = new TokenService();
