const express = require("express");
const path = require("path");
const fs = require("fs");
const apiBooksRouter = require("./routes/api/books");
const apiUserRouter = require("./routes/api/user");
const webRouter = require("./routes/web");

const app = express();

// Настройка шаблонизатора EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Парсинг тела запроса (JSON и URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Создаём папку для загрузок, если её нет
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// API-роуты
app.use("/api/books", apiBooksRouter);
app.use("/api/user", apiUserRouter);

// Веб-роуты (страницы)
app.use("/", webRouter);

// Error-handling middleware (по рекомендации преподавателя из последнего дз для перехвата ошибок)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});