import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { EFileTypes } from "../types/file.type";
import { IPaginationResponse, IQuery } from "../types/pagination.type";
import { IUser } from "../types/user.type";
import { s3Service } from "./s3.services";

//services передає привіт репозиторію і дані, які прийшли з controllers
class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async getAllWithPagination(
    req: Partial<IQuery>,
  ): Promise<IPaginationResponse<IUser>> {
    try {
      const queryStr = JSON.stringify(req);
      const queryObj = JSON.parse(
        queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
      );
      //значення по замовчуванню
      const {
        page = 1,
        limit = 5,
        sortedBy = "createdAt",
        ...searchObject
      } = queryObj;

      const [users, itemsFound] = await Promise.all([
        userRepository.getItemsFound(queryObj),
        userRepository.getCount(searchObject),
      ]);

      return {
        page: +page,
        limit: +limit,
        itemsFound: itemsFound,
        data: users,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async createUser(data: IUser): Promise<IUser> {
    return await userRepository.createUser(data);
  }

  public async getId(id: string): Promise<IUser> {
    return await userRepository.getId(id);
  }

  public deleteOne(id: string): Promise<any> {
    return userRepository.deleteOne(id);
  }

  public async uploadAvatar(
    avatar: UploadedFile,
    type: EFileTypes,
    id: string,
  ) {
    try {
      const user = await userRepository.getId(id);

      if (user.avatar) {
        await s3Service.deleteFile(user.avatar);
      }

      const filePath = await s3Service.uploadFile(avatar, EFileTypes.User, id); //promise  вертає назву файлу

      const updatedUser = await userRepository.updateOneById(id, {
        avatar: filePath,
      });

      return updatedUser;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const userService = new UserService();
