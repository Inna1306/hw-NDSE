import { v4 as uuid } from 'uuid';

export default class Book {
    constructor({
        title = '',
        description = '',
        authors = '',
        favorite = false,
        fileCover = '',
        fileName = '',
        fileBook = '',
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