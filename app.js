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

function checkFile(fileName) {
    if (fileName.includes('.')) {
        console.log('FILE:', fileName);
    } else {
        console.log('FOLDER:', fileName);
        fs.readdir(path.join(__dirname, fileName), (err, files) => {
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

    files.forEach((file) => {
        checkFile(file);
    });
});













