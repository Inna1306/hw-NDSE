const express = require("express");
const router = express.Router();
const storage = require("../models/storage");
const Book = require("../models/Book");
const upload = require("../middleware/upload");
const fs = require("fs");

// ---------- Список книг ----------
router.get("/", (req, res) => {
    res.redirect("/books");
});

router.get("/books", (req, res) => {
    res.render("index", { books: storage.books });
});

// ---------- Форма создания ----------
router.get("/books/create", (req, res) => {
    res.render("create");
});

// ---------- Форма редактирования ----------
router.get("/books/:id/edit", (req, res) => {
    const { id } = req.params;
    const book = storage.books.find((el) => el.id === id);
    if (!book) {
        return res.status(404).send("Книга не найдена");
    }
    res.render("update", { book });
});

// ---------- Удаление книги ----------
router.post("/books/:id/delete", (req, res) => {
    const { id } = req.params;
    const idx = storage.books.findIndex((el) => el.id === id);
    if (idx === -1) {
        return res.status(404).send("Книга не найдена");
    }
    const book = storage.books[idx];
    if (book.fileBook && fs.existsSync(book.fileBook)) {
        fs.unlinkSync(book.fileBook);
    }
    storage.books.splice(idx, 1);
    res.redirect("/books");
});

// ---------- Просмотр одной книги ----------
router.get("/books/:id", (req, res) => {
    const { id } = req.params;
    const book = storage.books.find((el) => el.id === id);
    if (!book) {
        return res.status(404).send("Книга не найдена");
    }
    res.render("view", { book });
});

// ---------- Обработка создания ----------
router.post("/books", upload, (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    let fileBook = "";
    if (req.file) {
        fileBook = req.file.path;
    }
    const favoriteBool = favorite === "on" || favorite === "true" || favorite === true;
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
    res.redirect("/books");
});

// ---------- Обработка обновления ----------
router.post("/books/:id", upload, (req, res) => {
    const { id } = req.params;
    const idx = storage.books.findIndex((el) => el.id === id);
    if (idx === -1) {
        return res.status(404).send("Книга не найдена");
    }
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    let fileBook = storage.books[idx].fileBook;
    if (req.file) {
        if (fileBook && fs.existsSync(fileBook)) {
            fs.unlinkSync(fileBook);
        }
        fileBook = req.file.path;
    }
    const updatedBook = {
        ...storage.books[idx],
        title: title !== undefined ? title : storage.books[idx].title,
        description: description !== undefined ? description : storage.books[idx].description,
        authors: authors !== undefined ? authors : storage.books[idx].authors,
        favorite: favorite !== undefined ? (favorite === "on" || favorite === "true" || favorite === true) : storage.books[idx].favorite,
        fileCover: fileCover !== undefined ? fileCover : storage.books[idx].fileCover,
        fileName: fileName !== undefined ? fileName : storage.books[idx].fileName,
        fileBook,
    };
    storage.books[idx] = updatedBook;
    res.redirect(`/books/${id}`);
});

module.exports = router;