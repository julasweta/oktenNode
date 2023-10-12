import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import * as path from "path";

import { configs } from "../configs/config";
import { templates } from "../constants/email.constant";
import { EEmailAction } from "../enums/email.action.enum";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      from: "No reply",
      service: "gmail",
      auth: {
        user: configs.NO_REPLY_EMAIL,
        pass: configs.NO_REPLY_PASSWORD,
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "layouts",
        ),
        partialsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "partials",
        ),
      },
      viewPath: path.join(process.cwd(), "src", "email-templates", "views"),
      extName: ".hbs",
    };

    this.transporter.use("compile", hbs(hbsOptions));
  }
  //templates експортуємо з email.constants
  //в context передаємо змінні для hbs
  public async sendMail(
    email: string | string[],
    emailAction: EEmailAction,
    context: Record<string, string | number> = {},
  ) {
    const mailOptions = {
      from: "stugarka@gmail.com",
      to: email,
      subject: templates[emailAction].subject,
      template: templates[emailAction].templateName,
      context,
    };
    return this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Помилка відправки листа:", error);
      } else {
        console.log("Лист відправлено:", info.response);
      }
    });
  }
}

export const emailService = new EmailService();
