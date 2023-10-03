import { FilterQuery } from "mongoose";

import { User } from "../models/User.model";
import { IUser } from "../types/user.type";

//репозиторії використовуємо для відправлення запитів в базу данних
class UserRepository {
  public async getAll(): Promise<IUser[]> {
    const users = await User.find();
    return users as IUser[];
  }

  public async createUser(data: IUser): Promise<IUser> {
    const newUserDocument = await User.create(data);
    const newUser: IUser = newUserDocument.toObject(); // Приводимо документ до типу IUser
    return newUser;
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
