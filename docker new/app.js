import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiBooksRouter from './routes/api/books.js';
import apiUserRouter from './routes/api/user.js';
import webRouter from './routes/web.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Парсинг тела запроса
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Папка для загрузок
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// API-роуты
app.use('/api/books', apiBooksRouter);
app.use('/api/user', apiUserRouter);

// Веб-роуты (страницы)
app.use('/', webRouter);

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});