const express = require("express");
const { v4: uuid } = require("uuid");

// ===== Класс Книги =====
class Book {
    constructor({
        title = "",
        description = "",
        authors = "",
        favorite = "",
        fileCover = "",
        fileName = "",
        id = uuid(),
    } = {}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    }
}

// ===== Хранилище в памяти - первоначально пустой массив =====
const storage = {
    books: [],
};

// ===== 1. Создаём приложение =====
const app = express();
app.use(express.json());

// ===== 2. Получить все книги =====
app.get("/api/books", (req, res) => {
    const { books } = storage;
    res.json(books);
});

// ===== 3. Получить книгу по ID =====
app.get("/api/books/:id", (req, res) => {
    const { books } = storage;
    const { id } = req.params;
    const book = books.find((el) => el.id === id);
    if (book) {
        res.json(book);
    } else {
        res.status(404);
        res.json("404 | Книга не найдена");
    }
});

// ===== 4. Создать книгу =====
app.post("/api/books", (req, res) => {
    const { books } = storage;
    const newBook = new Book(req.body); // все поля берутся из тела, id генерируется автоматически
    books.push(newBook);
    res.status(201);
    res.json(newBook);
});

// ===== 5. Редактировать книгу по ID =====
app.put("/api/books/:id", (req, res) => {
    const { books } = storage;
    const { id } = req.params;
    const idx = books.findIndex((el) => el.id === id);
    if (idx !== -1) {
        // Обновляем только переданные поля, остальные сохраняем
        books[idx] = { ...books[idx], ...req.body };
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json("404 | Книга не найдена");
    }
});

// ===== 6. Удалить книгу по ID =====
app.delete("/api/books/:id", (req, res) => {
    const { books } = storage;
    const { id } = req.params;
    const idx = books.findIndex((el) => el.id === id);
    if (idx !== -1) {
        books.splice(idx, 1);
        res.json("Книга удалена");
    } else {
        res.status(404);
        res.json("404 | Книга не найдена");
    }
});

// ===== Запуск сервера =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});