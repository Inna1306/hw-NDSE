const express = require("express");

const booksRouter = require("./routes/books");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json());

// ==== Подключаем роуты ====
app.use("/api/books", booksRouter);
app.use("/api/user", userRouter);




// ===== Запуск сервера =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});