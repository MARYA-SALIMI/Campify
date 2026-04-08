const express = require('express');
const cors = require('cors'); // CORS paketini yükle
const routes = require('./routesIndex');

const app = express();

// 1. CORS'U EN TEPEYE YERLEŞTİR VE TÜM SEÇENEKLERİ AÇ
app.use(cors({
    origin: '*', // Herhangi bir domainden gelen isteğe izin ver (localhost dahil)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Tüm HTTP metodlarına izin ver
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'] // Tüm gerekli başlıklara izin ver
}));

// 2. Body Parser Middleware
app.use(express.json());

// 3. API Rotaları
app.use('/api', routes);

module.exports = app;