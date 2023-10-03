import joi from "joi";

import { regexConstant } from "../constants/regex.constant";
import { EGenders } from "../enums/gender,enum";

export class UserValidator {
  //оголошуємо змінні які повторюються в коді нижче для подальшого використання
  static firstName = joi.string().min(2).max(50).trim();
  static age = joi.number().min(18).max(150);
  static genders = joi.valid(...Object.values(EGenders)).required();
  static email = joi.string().regex(regexConstant.EMAIL).trim().required();
  static password = joi.string().regex(regexConstant.PASSWORD).trim();

  //валідація вхідних даних при створенні юзера
  static create = joi.object({
    name: this.firstName.required(),
    age: this.age.required(),
    genders: this.genders.required(),
    email: this.email.required(),
    password: this.password.required(),
  });

  //валідація вхідних даних при оновленні юзера
  static update = joi.object({
    name: this.firstName,
    age: this.age,
    genders: this.genders,
  });
}
//npx eslintr --write .
