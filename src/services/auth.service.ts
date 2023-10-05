import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { ITokenPayload, ITokensPair } from "../types/token.type";
import { IUser } from "../types/user.type";
import { passwordService } from "./password.service";
import { tokenService } from "./token.services";

//services передає привіт репозиторію і дані, які прийшли з controllers
class AuthService {
  public async register(data: IUser): Promise<IUser> {
    const hashedPassword = await passwordService.hash(data.password);
    return await userRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  public async login(data: any): Promise<any> {
    //беремо юзера по емейлу, щоб звірити його пароль із тим що прийшов в запиті
    const user = await userRepository.getOneByParams({ email: data.email });
    if (!user) {
      throw new ApiError("Invalid user2", 401);
    }
    const checkPassword = await passwordService.compare(
      data.password,
      user.password,
    );
    if (!checkPassword) {
      throw new ApiError("Invalid password", 401);
    }
    //створюємо токени
    try {
      const tokens = tokenService.generateTokenPair({
        _userId: user._id,
        name: user.name,
      });
      return await tokenRepository.create({ ...tokens, _userId: user._id });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    payload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokensPair> {
    try {
      const tokensPair = tokenService.generateTokenPair({
        _userId: payload._userId,
        name: payload.name,
      });

      await Promise.all([
        tokenRepository.create({ ...tokensPair, _userId: payload._userId }),
        tokenRepository.deleteOne({ refreshToken }),
      ]);

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
