import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

//services передає привіт репозиторію і дані, які прийшли з controllers
class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
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
}

export const userService = new UserService();
