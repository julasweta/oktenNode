import { configs } from "../configs/config";
import { EEmailAction } from "../enums/email.action.enum";
import { EActionTokenType, EUserStatus } from "../enums/gender.enum";
import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { IActionToken, ITokenPayload, ITokensPair } from "../types/token.type";
import { IUser } from "../types/user.type";
import { emailService } from "./email.services";
import { passwordService } from "./password.service";
import { tokenService } from "./token.services";

//services передає привіт репозиторію і дані, які прийшли з controllers
class AuthService {
  public async register(data: IUser): Promise<IActionToken> {
    const hashedPassword = await passwordService.hash(data.password);
    const user = await userRepository.createUser({
      ...data,
      password: hashedPassword,
      status: EUserStatus.inactive,
    });
    const { accessToken } = tokenService.generateActivateToken(
      {
        _userId: user._id,
      },
      configs.JWT_ACTIVATE_SECRET,
    );

    //відправляємо лист для підтвердження активації
    /*  await emailService.sendMail(data.email, EEmailAction.REGISTER, {
      name: data.name,
      activаteToken: accessToken,
    }); */

    return await tokenRepository.createActivateToken({
      token: accessToken,
      type: EActionTokenType.activate,
      _userId: user._id,
    });
  }

  public async activate(payload: IActionToken): Promise<IUser> {
    try {
      const user = await userRepository.getOneByParams({
        _id: payload._userId,
      });
      //відправляємо лист для підтвердження активації
      await emailService.sendMail(user.email, EEmailAction.ACTIVATE, {
        name: user.name,
      });
      const user2 = await userRepository.updateOneById(user.id, {
        status: EUserStatus.active,
      });
      return user2;
    } catch (e) {
      throw new ApiError("ActivateService", 401);
    }
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

  public async logout(
    payload: ITokenPayload,
    accessToken: string,
  ): Promise<any> {
    try {
      //для видалення всіх сесій юзера  - deleteAll
      return await tokenRepository.deleteAll({ _userId: payload._userId });
      //для видалення даної сесії deleteOne
      if (accessToken)
        return await tokenRepository.deleteOne({ _userId: payload._userId });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  //1 - отримуємо емейл, перевіряємо, генеруємо токен, відправляємо листа
  public async forgot(user: IUser): Promise<any> {
    try {
      //1.генеруємо фктивац токен
      const { accessToken } = tokenService.generateActivateToken(
        {
          _userId: user._id,
        },
        configs.JWT_FORGOT_SECRET,
      );
      //2.записуємо цей токен
      const tokenForgot = await tokenRepository.createActivateToken({
        token: accessToken,
        type: EActionTokenType.forgotPassword,
        _userId: user._id,
      });
      //відправляємо лист з токеном
      emailService.sendMail(user.email, EEmailAction.FORGOT_PASSWORD, {
        accessToken,
      });
      return tokenForgot;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  //
  public async setForgotPassword(
    actionToken: string,
    newPassword: string,
    payload: any,
  ): Promise<any> {
    try {
      const entity = await tokenRepository.findOneActionToken({
        token: actionToken,
      });
      if (!entity) {
        throw new ApiError("Not valid token", 400);
      }
      const newHashedPassword = await passwordService.hash(newPassword);

      await Promise.all([
        userRepository.updateOneById(payload._userId, {
          password: newHashedPassword,
        }),
        tokenRepository.deleteOne({ token: actionToken }),
      ]);
      return "password update";
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
