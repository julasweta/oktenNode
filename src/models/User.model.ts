import {model, Schema} from "mongoose";
import {EGenders} from "../enums/gender,enum";

// Схема користувача
const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        age: {
            type: Number,
            min: [1, "Minimum age is 1"],
            max: [199, "Maximum age is 199"],
        },
        genders: {
            type: String,
            enum: EGenders,
        },
        email: {
            type: String,      // Тип поля - рядок (String).
            required: true,    // Обов'язкове поле, має бути заповнене при збереженні об'єкта.
            lowercase: true,   // Змінює всі символи на нижній регістр.
            unique: true,      // Забезпечує унікальність значень поля у колекції.
            trim: true,        // Видаляє пробіли з обох кінців значення поля.
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        /* timestamps: true додає два додаткові поля: createdAt та updatedAt.
        createdAt містить час створення документа, а updatedAt - час останньої модифікації. */
        timestamps: true,

        /*  Це поле зазвичай використовується для контролю версій документів у колекції.
        Якщо вам не потрібен контроль версій, ви можете вимкнути це поле. */
        versionKey: false,
    },
);


// Модель користувача
export const User = model("user", userSchema);