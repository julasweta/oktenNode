import { FilterQuery } from "mongoose";

import { ApiError } from "../errors/api.error";
import { ActionToken } from "../models/ActionToken.models";
import { Token } from "../models/Token.models";
import { IActionToken, IToken } from "../types/token.type";

//репозиторії використовуємо для відправлення запитів в базу данних
class TokenRepository {
  public async create(tokens: Partial<IToken>): Promise<any> {
    try {
      return await Token.create(tokens);
    } catch (e) {
      throw new ApiError(e.message, 401);
    }
  }

  public async createActivateToken(data: IActionToken): Promise<IActionToken> {
    try {
      return await ActionToken.create(data);
    } catch (e) {
      throw new ApiError(e.message, 401);
    }
  }

  public async findOne(params: FilterQuery<IToken>): Promise<IToken> {
    try {
      return await Token.findOne(params);
    } catch (e) {
      throw new ApiError("error findOne", e.status);
    }
  }

  public async findOneActionToken(
    params: FilterQuery<IToken>,
  ): Promise<IToken> {
    try {
      return await ActionToken.findOne(params);
    } catch (e) {
      throw new ApiError("error findOne", e.status);
    }
  }

  public async deleteOne(params: FilterQuery<IToken>): Promise<void> {
    await Token.deleteOne(params);
  }

  public async deleteAll(params: FilterQuery<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }
}

export const tokenRepository = new TokenRepository();
