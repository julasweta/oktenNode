/* eslint-disable prettier/prettier */
import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ApiError } from "../errors/api.error";
import { User } from "../models/User.model";
//https://github.com/iamkun/dayjs/blob/dev/docs/ru/README-ru.md

dayjs.extend(utc);

const checkTokens = async function () {
  try {
   // const data = dayjs().utc().subtract(1, "d");
    await User.aggregate([
      {
        $lookup: {
          from: "tokens",
          localField: "_id",
          foreignField: "_userId",
          as: "result",
        },
      },
      {
        $addFields: {
          result: { $ne: ["$result", []] },
        },
      },
    ]);

  } catch (e) {
    throw new ApiError(e.message, e.status);
  }

  // lte = less than equal
  // gte = greater than equal
  // gt = greater than
  // lt = less than
};

export const checkIsTokens = new CronJob("*/150 * */10 * * *", checkTokens);
