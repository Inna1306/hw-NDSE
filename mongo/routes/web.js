import express from 'express';
import storage from '../models/storage.js';
import Book from '../models/book.js';
import upload from '../middleware/upload.js';
import fs from 'fs';
import axios from 'axios';

const router = express.Router();
const COUNTER_URL = process.env.COUNTER_URL || 'http://counter:3001';

// ---------- Список книг ----------
router.get('/', (req, res) => {
    res.redirect('/books');
});

router.get('/books', (req, res) => {
    res.render('index', { books: storage.books });
});

// ---------- Форма создания ----------
router.get('/books/create', (req, res) => {
    res.render('create');
});

// ---------- Обработка создания ----------
router.post('/books', upload, (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    let fileBook = '';
    if (req.file) {
        fileBook = req.file.path;
    }

    const favoriteBool = favorite === 'on' || favorite === 'true' || favorite === true;

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
    res.redirect('/books');
});

// ---------- Форма редактирования ----------
router.get('/books/:id/edit', (req, res) => {
    const { id } = req.params;
    const book = storage.books.find(b => b.id === id);
    if (!book) {
        return res.status(404).send('Книга не найдена');
    }
    res.render('update', { book });
});

// ---------- Обработка обновления ----------
router.post('/books/:id', upload, (req, res) => {
    const { id } = req.params;
    const idx = storage.books.findIndex(b => b.id === id);
    if (idx === -1) {
        return res.status(404).send('Книга не найдена');
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
        favorite: favorite !== undefined ? (favorite === 'on' || favorite === 'true' || favorite === true) : storage.books[idx].favorite,
        fileCover: fileCover !== undefined ? fileCover : storage.books[idx].fileCover,
        fileName: fileName !== undefined ? fileName : storage.books[idx].fileName,
        fileBook,
    };

    storage.books[idx] = updatedBook;
    res.redirect(`/books/${id}`);
});

// ---------- Удаление книги ----------
router.post('/books/:id/delete', (req, res) => {
    const { id } = req.params;
    const idx = storage.books.findIndex(b => b.id === id);
    if (idx === -1) {
        return res.status(404).send('Книга не найдена');
    }

    const book = storage.books[idx];
    if (book.fileBook && fs.existsSync(book.fileBook)) {
        fs.unlinkSync(book.fileBook);
    }

    storage.books.splice(idx, 1);
    res.redirect('/books');
});

// ---------- Просмотр одной книги (с увеличением счётчика) ----------
router.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    const book = storage.books.find(b => b.id === id);
    if (!book) {
        return res.status(404).send('Книга не найдена');
    }

    let viewCount = 0;
    try {
        await axios.post(`${COUNTER_URL}/counter/${id}/incr`);
        const response = await axios.get(`${COUNTER_URL}/counter/${id}`);
        viewCount = response.data.count || 0;
    } catch (error) {
        console.error('Ошибка при обращении к счётчику:', error.message);
    }

    res.render('view', { book, viewCount });
});

export default router;