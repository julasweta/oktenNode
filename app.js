/*
HW2 – закінчити з CRUD операціями. 

Створити базу юзерів в db.json, при створенні записувати туди нових юзерів через fs

При створенні зробити валідацію на ім'я і вік, ім'я повинно бути більше 3 символів, вік – не менше нуля

На get, put, delete юзерів перевірити чи такий юзер є.

*/
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, `users.json`);
let users = [];
let errors = [];

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Читаємо вміст файлу users,json
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Помилка читання файлу: ${err}`);
        return;
    }

    // Парсимо JSON дані
    try {
        const usersPars = JSON.parse(data);
        // console.log('Дані з users.json:', usersPars);
        users = usersPars;
    } catch (parseError) {
        console.error(`Помилка парсингу JSON: ${parseError}`);
    }
});

//функція, що записує оновлені дані в users.json
function changeUsersJson() {
    // Конвертуємо оновлені дані у JSON рядок
    const updatedUsersJSON = JSON.stringify(users, null, 2);

    // Перезаписуємо файл з оновленими даними
    fs.writeFile(filePath, updatedUsersJSON, 'utf8', (err) => {
        if (err) {
            console.error(`Помилка запису в файл: ${err}`);
            return;
        }
        console.log('Файл users.json успішно оновлено.');
    });
}

//валідація данних
function validation(req) {

    if (req.body.name.length < 3) {
        errors.push({nameError: 'Некоректне ім\'я користувача'});
    }
    if (req.body.age <= 0) {
        errors.push({ageError: 'Вік має бути більше 0'});
    }
    if (errors.length > 0) {
        return false;
    } else
        return true;

}

//перевірка на наявність юзера
function isUser(id) {

    newArr = users.filter(user => user.id === id);
    if (newArr.length > 0) {
        return true;
    } else {
        errors.push({errorUser: 'Юзера не знайдено'});
        return false;
    }
}

app.get('/users', (req, res) => {
    res.json({
        data: users,
    });
});

app.get('/users/:id', (req, res) => {
    const {id} = req.params;
    if (isUser(id)) {
        res.json({
            data: users[+id - 1],
        });
    } else {
        res.status(400).json({
            errorUser: errors[0],
        });
    }
});

app.post('/users', (req, res) => {
    errors = [];
    if (validation(req)) {
        const userData = req.body;

        if (userData) {
            users.push(userData);
            changeUsersJson();

            res.status(201).json({
                message: "User created",
            });
        }
    } else {
        res.status(400).json({
            errorName: errors[0],
            errorAge: errors[1],
        });
    }
});


app.delete('/users/:id', (req, res) => {
    errors = [];
    const {id} = req.params;
    if (isUser(+id)) {
        const newarr = users.filter(user => user.id != +id);
        users = newarr;
        changeUsersJson();
        res.status(201).json({
            message: "User deleted"
        });
    }
    else {
        res.status(400).json({
            errorName: errors[0],
        });
    }
});

app.put('/users/:id', (req, res) => {
    errors = [];
    const {id} = req.params;
    if (validation(req) && isUser(+id)) {

        const userChange = req.body;

        const newarr = users.map(user => {
            if (user.id == +id) {
                return userChange;
            }
            return user;
        });
        users = newarr;
        changeUsersJson();

        res.status(201).json({
            message: "User updated",
        });
    } else {

        res.status(400).json({
            errorName: errors[0],
            errorAge: errors[1],
            errorUser: errors[2],
        });

    }

});


const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server has successfully started on PORT ${PORT}`);
});










