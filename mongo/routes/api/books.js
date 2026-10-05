import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

import Books from '../../models/book.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

async function findBook(id) {
    let book = await Books.findOne({ id });

    if (!book && mongoose.isValidObjectId(id)) {
        book = await Books.findById(id);
    }

    return book;
}

// получить все книги
router.get('/', async (req, res, next) => {
    try {
        const books = await Books.find();
        res.json(books);
    } catch (err) {
        next(err);
    }
});

//  получить книгу по ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await findBook(id);

        if (book) {
            res.json(book);
        } else {
            res.status(404).json('404 | Книга не найдена');
        }
    } catch (err) {
        next(err);
    }
});

//  создать книгу
router.post('/', upload, async (req, res, next) => {
    try {
        const { title, description, authors, favorite, fileCover, fileName } = req.body;

        const newBook = await Books.create({
            id: uuid(),
            title,
            description,
            authors,
            favorite: String(favorite ?? ''),
            fileCover,
            fileName,
            fileBook: req.file ? req.file.path : '',
        });

        res.status(201).json(newBook);
    } catch (err) {
        next(err);
    }
});

// редактировать книгу по ID 

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, authors, favorite, fileCover, fileName } = req.body;

        const update = {};
        if (title !== undefined) update.title = title;
        if (description !== undefined) update.description = description;
        if (authors !== undefined) update.authors = authors;
        if (favorite !== undefined) update.favorite = String(favorite);
        if (fileCover !== undefined) update.fileCover = fileCover;
        if (fileName !== undefined) update.fileName = fileName;

        const existing = await findBook(id);
        if (!existing) {
            return res.status(404).json('404 | Книга не найдена');
        }

        const updatedBook = await Books.findOneAndUpdate(
            { _id: existing._id },
            { $set: update },
            { new: true }
        );

        res.json(updatedBook);
    } catch (err) {
        next(err);
    }
});
//удалить книгу по ID

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await findBook(id);
        if (!existing) {
            return res.status(404).json('404 | Книга не найдена');
        }

        await Books.findOneAndDelete({ _id: existing._id });


        if (existing.fileBook && fs.existsSync(existing.fileBook)) {
            fs.unlinkSync(existing.fileBook);
        }

        res.json('ok');
    } catch (err) {
        next(err);
    }
});

//скачать файл книги
router.get('/:id/download', async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await findBook(id);

        if (!book) {
            return res.status(404).json('404 | Книга не найдена');
        }

        if (!book.fileBook || !fs.existsSync(book.fileBook)) {
            return res.status(404).json('404 | Файл книги не найден');
        }

        res.download(book.fileBook, book.fileName || 'book.pdf', (err) => {
            if (err && !res.headersSent) {
                console.error('Ошибка при скачивании:', err);
                res.status(500).json('Ошибка сервера');
            }
        });
    } catch (err) {
        next(err);
    }
});

export default router;