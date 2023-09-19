/*
Створіть папку
В тій папці створіть 5 папок і 5 файлів
І за допомогою модулю fs виведіть в консоль, чи це папка чи це файл
FILE: {fileName}
FOLDER: {folderName}

/* FS */
const fs = require('fs');
const path = require('path');
const folderBase = path.join(__dirname);

/*------- Створення папок і файлів ----- */
const folderNames = ['services', 'routing', 'layout', 'constants', 'components'];
const fileNames = ['services', 'routing', 'layout', 'constants', 'components'];


/* Створення файлів */
function createFile(folderPath, nameFile) {
    const filePath = path.join(folderPath, `${nameFile}.txt`);
    fs.writeFile(filePath, '', (err) => {
        if (err) {
            console.error(`Помилка при створенні файлу  у папці ${nameFile}: ${err}`);
        } else {
            console.log(`Успішно створено файл  у папці ${nameFile}`);
        }
    });
};

fileNames.forEach(nameFile => {
    createFile(folderBase, nameFile);
});



//створення папок та файлів в них

folderNames.forEach(folderName => {
    const folderPath = path.join(folderBase, folderName);

    // Спочатку створимо папку
    fs.mkdir(folderPath, (err) => {
        if (err) {
            console.error(`Помилка при створенні папки ${folderName}: ${err}`);
            return;
        }
        console.log(`Створено папку ${folderName}`);
        // створення файлу у цій папці
        createFile(folderPath, folderName);
    });
});


/*------------------- Без вложених файлів--------------------- */
console.log(' ---- Без вложених файлів ---- ');
fs.readdir(folderBase,
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
    });

/*---------------------  З вложеними файлами, fs.readdir без опцій, рекурсія---------------------- */

function checkFile(fileName) {
    if (fileName.includes('.')) {
        console.log('FILE:', fileName);
    } else {
        console.log('FOLDER:', fileName);
        fs.readdir(path.join(folderBase, fileName), (err, files) => {
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

fs.readdir(folderBase, (err, files) => {
    if (err) {
        console.error('Помилка зчитування папки: ' + err);
        return;
    }
    console.log(' ---- З вложеними файлами ---- ');
    files.forEach((file) => {
        checkFile(file);
    });
});











