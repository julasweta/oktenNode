/*
HW2 – закінчити з CRUD операціями. 

Створити базу юзерів в db.json, при створенні записувати туди нових юзерів через fs

При створенні зробити валідацію на ім'я і вік, ім'я повинно бути більше 3 символів, вік – не менше нуля

На get, put, delete юзерів перевірити чи такий юзер є.

*/
const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, `users.json`);
let users = [];
let errors = [];

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Читаємо вміст файлу users,json

const readFile = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const usersPars = JSON.parse(data);
        users = usersPars;
    } catch (error) {
        console.error('Помилка зчитування файлу:', error);
    }
};


//функція, що записує оновлені дані в users.json
async function changeUsersJson() {
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
async function isUser(id) {
    await readFile();
    if (users.length > 0) {
        newArr = users.filter(user => {
            user.id === +id;
        });
        if (newArr.length > 0) {
            return true;
        } else {
            errors.push({errorUser: 'Юзера не знайдено'});
            return false;
        }
    }
}

app.get('/users', async (req, res) => {
    await readFile();
    res.json({
        data: users,
    });
});

app.get('/users/:id', async (req, res) => {
    await readFile();
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



app.post('/users', async (req, res) => {
    errors = [];
    if (validation(req)) {
        await readFile();
        const data = req.body;
        const newId = users.length + 1;
        const userData = {
            id: newId,
            name: data.name,
            email: data.email,
            age: data.age
        };
        if (userData) {
            await readFile();
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

app.put('/users/:id', async (req, res) => {

    errors = [];
    const {id} = req.params;
    if (validation(req) && isUser(+id)) {
        await readFile();
        const userChange = req.body;

        const newarr = users.map(user => {
            if (user.id == +id) {
                return {
                    id: user.id,
                    name: userChange.name ? userChange.name : user.name,
                    email: userChange.email ? userChange.email : user.email,
                    age: userChange.age ? userChange.age : user.age
                };
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










