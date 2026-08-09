const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Путь к папке для загруженных файлов
const uploadDir = path.join(__dirname, "..", "uploads");

// Создаём папку, если её нет
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Уникальное имя
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

// Создаём экземпляр multer с этими настройками
const upload = multer({ storage });

// Экспортируем middleware для загрузки одного файла с именем поля "fileBook"
module.exports = upload.single("fileBook");