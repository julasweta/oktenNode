/*
Створіть папку
В тій папці створіть 5 папок і 5 файлів
І за допомогою модулю fs виведіть в консоль, чи це папка чи це файл
FILE: {fileName}
FOLDER: {folderName}

/* FS */
const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname);


/*------------------- Без вложених файлів--------------------- */ 
console.log(' ---- Без вложених файлів ---- ');
fs.readdir(folderPath,
    {withFileTypes: true},
    (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.isDirectory()) {
                    console.log('FOLDER:', file.name);
                } else {
                    console.log('FILE:', file.name);
                }
            });
        }
    })

/*---------------------  З вложеними файлами, fs.readdir без опцій, рекурсія---------------------- */

function checkFile(fileName) {
    if (fileName.includes('.')) {
        console.log('FILE:', fileName);
    } else {
        console.log('FOLDER:', fileName);
        fs.readdir(path.join(folderPath, fileName), (err, files) => {
            if (err) {
                console.error('Помилка зчитування папки: ' + err);
                return;
            }
            files.forEach((file) => {
                console.log('File in Folder:', fileName);
                checkFile(file);
            });
        });
    }
}

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Помилка зчитування папки: ' + err);
        return;
    }
    console.log(' ---- З вложеними файлами ---- ');
    files.forEach((file) => {
        checkFile(file);
    });
});











