import { FilterQuery } from "mongoose";

import { ApiError } from "../errors/api.error";
import { User } from "../models/User.model";
import { IQuery } from "../types/pagination.type";
import { IUser } from "../types/user.type";

//репозиторії використовуємо для відправлення запитів в базу данних
class UserRepository {
  public async getAll(): Promise<IUser[]> {
    const users = await User.find();
    return users as IUser[];
  }

  public async createUser(data: Partial<IUser>): Promise<IUser> {
    try {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getItemsFound({
    page,
    limit,
    sortedBy,
    ...searchObject
  }: IQuery) {
    //skip - з якого item почати пошук limit*(к-сть сторінок мінус 1) і отримуємо номер з якого починається item
    const skip = +limit * (+page - 1);
    return await User.find(searchObject)
      .limit(+limit)
      .skip(skip)
      .sort(sortedBy);
  }

  public async getCount(searchObject: any) {
    //рахуємо кількість знайдених items по параметрах переданого обєкту, наприклад обєкт {name=Julianna}
    return await User.count(searchObject);
  }
}

export const userRepository = new UserRepository();
