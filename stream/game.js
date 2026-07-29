const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Получаем имя файла для логирования
const logFileName = process.argv[2];
if (!logFileName) {
    console.error('Ошибка: укажите имя файла для логирования.');
    process.exit(1);
}
const logFilePath = path.resolve(__dirname, logFileName);

// Функция для записи в лог-файл
function logToFile(content) {
    fs.appendFile(logFilePath, content + '\n', (err) => {
        if (err) {
            console.error('Ошибка записи в лог-файл:', err);
        }
    });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log('Добро пожаловать в игру "Орёл или решка"!\nВведите 1 (орёл) или 2 (решка). Для выхода наберите "exit".\n');

function askQuestion() {
    const actual = Math.floor(Math.random() * 2) + 1;

    rl.question('Ваш выбор (1 или 2): ', (answer) => {
        const trimmed = answer.trim().toLowerCase();

        // Выход из игры
        if (trimmed === 'exit') {
            console.log('Выход из игры...');
            logToFile('exit');               // логируем выход
            rl.close();
            return;
        }

        // Проверка ввода
        if (trimmed !== '1' && trimmed !== '2') {
            console.log('Пожалуйста, введите 1, 2 или "exit".');
            askQuestion();                   // повтор без логирования
            return;
        }

        const guess = Number(trimmed);
        const isWin = guess === actual;
        const result = isWin ? 'win' : 'loss';
        const coinSide = actual === 1 ? 'орёл' : 'решка';

        if (isWin) {
            console.log('Поздравляем! Вы угадали!');
        } else {
            console.log(`Увы, выпал ${coinSide}. Попробуйте ещё раз.`);
        }

        // Логируем результат
        logToFile(`Игрок выбрал: ${guess},\nЧисло: ${actual},\nРезультат: ${result}`);

        // Запускаем следующий ход
        askQuestion();
    });
}

// Первый запуск
askQuestion();