const readline = require('readline');

// Настройка readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Генерация случайного числа
const min = 0;
const max = 100;
const secret = Math.floor(Math.random() * (max - min + 1)) + min;

console.log(`Я загадал число в диапазоне от ${min} до ${max}`);

// Обработка каждой введённой строки
rl.on('line', (input) => {
    const guess = parseInt(input.trim(), 10);

    if (isNaN(guess)) {
        console.log('Пожалуйста, введите число.');
        return;
    }

    if (guess === secret) {
        console.log(`Вы отгадали число: ${secret}. Поздравляю!`);
        rl.close();
    } else if (guess < secret) {
        console.log('Больше');
    } else {
        console.log('Меньше');
    }
});

// Завершение программы при закрытии потока
rl.on('close', () => {
    process.exit(0);
});