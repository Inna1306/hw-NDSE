const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const DATA_FILE = '/data/counters.json';

let counters = {};

if (fs.existsSync(DATA_FILE)) {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        counters = JSON.parse(data);
    } catch (e) {
        console.error('Ошибка загрузки данных', e);
        counters = {};
    }
} else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(counters), 'utf8');
}

function saveCounters() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(counters), 'utf8');
}

app.post('/counter/:bookId/incr', (req, res) => {
    const { bookId } = req.params;
    if (!counters[bookId]) counters[bookId] = 0;
    counters[bookId] += 1;
    saveCounters();
    res.json({ count: counters[bookId] });
});

app.get('/counter/:bookId', (req, res) => {
    const { bookId } = req.params;
    const count = counters[bookId] || 0;
    res.json({ count });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Counter service running on port ${PORT}`);
});