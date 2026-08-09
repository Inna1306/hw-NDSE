const express = require("express");
const { v4: uuid } = require("uuid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/upload");

const router = express.Router();

// ===== Класс Книги =====
class Book {
    constructor({
        title = "",
        description = "",
        authors = "",
        favorite = "",
        fileCover = "",
        fileName = "",
        fileBook = "",
        id = uuid(),
    } = {}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}

// ===== Хранилище в памяти - первоначально пустой массив =====
const storage = {
    books: [],
};


// ===== 2. Получить все книги =====
router.get("/", (req, res) => {
    res.json(storage.books);
});

// ===== 3. Получить книгу по ID =====
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const book = storage.books.find((el) => el.id === id);
    if (book) {
        res.json(book);
    } else {
        res.status(404);
        res.json("404 | Книга не найдена");
    }
});

// ===== 4. Создать книгу c загрузкой файла =====
router.post("/", upload, (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    let fileBook = "";
    if (req.file) {
        fileBook = req.file.path; // полный путь к файлу
    }

    const favoriteBool = favorite === "true" || favorite === true;

    const newBook = new Book({
        title,
        description,
        authors,
        favorite: favoriteBool,
        fileCover,
        fileName,
        fileBook,
    });

    storage.books.push(newBook);
    res.status(201).json(newBook);
});
// ===== 5. Редактировать книгу по ID =====
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const idx = storage.books.findIndex((el) => el.id === id);
    if (idx === -1) {
        return res.status(404);
        res.json("404 | Книга не найдена");

    }

    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    const updatedBook = {
        ...storage.books[idx],
        title: title !== undefined ? title : storage.books[idx].title,
        description: description !== undefined ? description : storage.books[idx].description,
        authors: authors !== undefined ? authors : storage.books[idx].authors,
        favorite: favorite !== undefined ? (favorite === "true" || favorite === true) : storage.books[idx].favorite,
        fileCover: fileCover !== undefined ? fileCover : storage.books[idx].fileCover,
        fileName: fileName !== undefined ? fileName : storage.books[idx].fileName,
        // fileBook не изменяем
    };
    storage.books[idx] = updatedBook;
    res.json(updatedBook);
});

// 5. Удалить книгу по ID (и удаляем файл, если он существует)
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const idx = storage.books.findIndex((b) => b.id === id);
    if (idx === -1) {
        return res.status(404);
        res.json("404 | Книга не найдена");

    }

    const book = storage.books[idx];
    if (book.fileBook && fs.existsSync(book.fileBook)) {
        fs.unlinkSync(book.fileBook);
    }

    storage.books.splice(idx, 1);
    res.json("ok");
});

// 6. Скачать файл книги по ID
router.get("/:id/download", (req, res) => {
    const { id } = req.params;
    const book = storage.books.find((b) => b.id === id);
    if (!book) {
        return res.status(404);
        res.json("404 | Книга не найдена");

    }

    if (!book.fileBook || !fs.existsSync(book.fileBook)) {
        return res.status(404);
        res.json("404 | Файл книги не найден");

    }
    res.download(book.fileBook, book.fileName || "book.pdf", (err) => {
        if (err) {
            console.error("Ошибка при скачивании файла:", err);
            res.status(500)
            res.json("500 | Ошибка сервера");
        }
    });
});

module.exports = router;
