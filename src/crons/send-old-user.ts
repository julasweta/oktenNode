/* eslint-disable prettier/prettier */
import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { EEmailAction } from "../enums/email.action.enum";
import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "../services/email.services";
import { IUser } from "../types/user.type";

dayjs.extend(utc);

const tokensRemover = async function () {
  try {
    const previousMonth = dayjs().utc().subtract(2, "d");

    const users = await userRepository.getAllByParams({
      createdAt: { $lte: previousMonth },
    });
    const message =
      "Ваш акаунт давно не використовувався. Будь ласка, увійдіть для активного використання.";

    await users.map((user: IUser) => {
      emailService.sendMail(user.email, EEmailAction.REGISTER, {
        name: user.name,
        message: message,
      });
    });
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const sendOldUser = new CronJob("0 0 */10 */5 * *", tokensRemover);
