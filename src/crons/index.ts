/* eslint-disable prettier/prettier */
import { removeOldTokens} from "./remove-old-tokens.cron";
import { sendOldUser } from "./send-old-user";

export const cronRunner = () => {
  removeOldTokens.start();
  sendOldUser.start();
};