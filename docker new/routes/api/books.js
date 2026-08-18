import express from 'express';
import storage from '../../models/storage.js';
import Book from '../../models/book.js';
import upload from '../../middleware/upload.js';
import fs from 'fs';

const router = express.Router();

// Получить все книги
router.get('/', (req, res) => {
    res.json(storage.books);
});

// Получить книгу по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const book = storage.books.find(b => b.id === id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json('404 | Книга не найдена');
    }
});

// Создать книгу (с загрузкой файла)
router.post('/', upload, (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    let fileBook = '';
    if (req.file) {
        fileBook = req.file.path;
    }

    const favoriteBool = favorite === 'true' || favorite === true;

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

// Обновить книгу (без изменения файла)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const idx = storage.books.findIndex(b => b.id === id);
    if (idx === -1) {
        return res.status(404).json('404 | Книга не найдена');
    }

    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    const updatedBook = {
        ...storage.books[idx],
        title: title !== undefined ? title : storage.books[idx].title,
        description: description !== undefined ? description : storage.books[idx].description,
        authors: authors !== undefined ? authors : storage.books[idx].authors,
        favorite: favorite !== undefined ? (favorite === 'true' || favorite === true) : storage.books[idx].favorite,
        fileCover: fileCover !== undefined ? fileCover : storage.books[idx].fileCover,
        fileName: fileName !== undefined ? fileName : storage.books[idx].fileName,
    };
    storage.books[idx] = updatedBook;
    res.json(updatedBook);
});

// Удалить книгу (и файл)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const idx = storage.books.findIndex(b => b.id === id);
    if (idx === -1) {
        return res.status(404).json('404 | Книга не найдена');
    }

    const book = storage.books[idx];
    if (book.fileBook && fs.existsSync(book.fileBook)) {
        fs.unlinkSync(book.fileBook);
    }

    storage.books.splice(idx, 1);
    res.json('ok');
});

// Скачать файл книги
router.get('/:id/download', (req, res) => {
    const { id } = req.params;
    const book = storage.books.find(b => b.id === id);
    if (!book) {
        return res.status(404).json('404 | Книга не найдена');
    }

    if (!book.fileBook || !fs.existsSync(book.fileBook)) {
        return res.status(404).json('404 | Файл книги не найден');
    }

    res.download(book.fileBook, book.fileName || 'book.pdf', (err) => {
        if (err) {
            console.error('Ошибка при скачивании:', err);
            res.status(500).json('Ошибка сервера');
        }
    });
});

export default router;