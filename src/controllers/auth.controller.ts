/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import {
  IToken,
  ITokenActivate,
  ITokenPayload,
  ITokensPair,
} from "../types/token.type";
import { IUser } from "../types/user.type";
// Controller  тільки вказує хто буде обробляти запит, а сам запит передає Services
// також тут передаються дані для запиту і відправляється тут response

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokenActivate>> {
    try {
      const accessToken = await authService.register(req.body);
      return res.status(201).json(accessToken);
    } catch (error) {
      next(error);
    }
  }

  public async activate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IToken>> {
    try {
      const user = req.res.locals.user;
      const result = await authService.activate(user);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const tokens = await authService.login(req.body);
      res.status(201).json(tokens);
    } catch (e) {
      next(e);
    }
  }
  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const refreshToken = req.res.locals.refreshToken as string;

      const tokensPair = await authService.refresh(tokenPayload, refreshToken);

      return res.status(201).json(tokensPair);
    } catch (e) {
      next(e);
    }
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const accessToken = req.res.locals.accessToken as string;

      const result = await authService.logout(tokenPayload, accessToken);
      console.log(result);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async forgot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const user = req.res.locals.user;
      await authService.forgot(user as IUser);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
