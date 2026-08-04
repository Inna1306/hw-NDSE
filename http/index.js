const http = require('http');
const config = require('./config');

// 1. Получаем название города из аргументов командной строки
const city = process.argv[2];
if (!city) {
  console.error('Укажите название города, например: node index.js Moscow');
  process.exit(1);
}

// 2. Проверяем наличие API-ключа
const apiKey = config.WEATHER_API_KEY;
if (!apiKey) {
  console.error('Переменная окружения WEATHER_API_KEY не задана.');
  console.error('Создайте файл .env с содержимым: WEATHER_API_KEY=ваш_ключ');
  process.exit(1);
}

// 3. Формируем URL для запроса
const url = `${config.WEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${config.UNITS}&lang=${config.LANG}`;

// 4. Выполняем GET-запрос
http.get(url, (res) => {
  const { statusCode } = res;

  // Обработка некорректного статуса
  if (statusCode !== 200) {
    console.error(`Ошибка HTTP: ${statusCode}`);
    res.setEncoding('utf8');
    let errorData = '';
    res.on('data', (chunk) => (errorData += chunk));
    res.on('end', () => {
      try {
        const parsed = JSON.parse(errorData);
        console.error(`   Сообщение: ${parsed.message || 'неизвестная ошибка'}`);
      } catch {
        console.error(`   Ответ сервера: ${errorData}`);
      }
    });
    return;
  }

  // Сбор данных ответа
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => (rawData += chunk));
  res.on('end', () => {
    try {
      const data = JSON.parse(rawData);

      // 5. Вывод прогноза в удобочитаемом виде
      console.log(`\nПогода в городе ${data.name}, ${data.sys.country}:`);
      console.log(`Температура: ${data.main.temp}°C`);
      console.log(`${data.weather[0].description}`);
      console.log(`Влажность: ${data.main.humidity}%`);
      console.log(`Ветер: ${data.wind.speed} м/с`);
      console.log(`Давление: ${data.main.pressure} гПа`);
    } catch (err) {
      console.error('Ошибка при разборе JSON:', err.message);
    }
  });
}).on('error', (err) => {
  console.error('Ошибка запроса:', err.message);
});