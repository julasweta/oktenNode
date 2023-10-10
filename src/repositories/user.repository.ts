import { FilterQuery } from "mongoose";

import { User } from "../models/User.model";
import { IUser } from "../types/user.type";

//репозиторії використовуємо для відправлення запитів в базу данних
class UserRepository {
  public async getAll(): Promise<IUser[]> {
    const users = await User.find();
    return users as IUser[];
  }

  public async createUser(data: Partial<IUser>): Promise<IUser> {
    return await User.create(data);
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
}

export const userRepository = new UserRepository();
