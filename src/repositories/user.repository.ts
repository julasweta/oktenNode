import { FilterQuery } from "mongoose";

import { ApiError } from "../errors/api.error";
import { User } from "../models/User.model";
import { IUser } from "../types/user.type";

//репозиторії використовуємо для відправлення запитів в базу данних
class UserRepository {
  public async getAll(): Promise<IUser[]> {
    const users = await User.find();
    return users as IUser[];
  }

  public async createUser(data: Partial<IUser>): Promise<IUser> {
    try {
      console.log("createUserReposit", data);
      return await User.create(data);
    } catch (e) {
      throw new ApiError("userCreate error", 401);
    }
  }

  public async updateOneById(
    userId: string,
    dto: Partial<IUser>,
  ): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  public async getId(id: string): Promise<IUser> {
    return await User.findById(id);
  }

  public async deleteOne(id: string): Promise<any> {
    return await User.deleteOne({ _id: id });
  }

  public async getOneByParams(email: FilterQuery<IUser>): Promise<any> {
    return await User.findOne(email);
  }

  public async getAllByParams(createdAt: any): Promise<any> {
    return await User.find(createdAt);
  }
}

export const userRepository = new UserRepository();
