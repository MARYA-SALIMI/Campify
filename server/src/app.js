const express = require('express');
const routes = require('./routesIndex');

const app = express();

// Gelen isteklerdeki JSON verilerini okuyabilmek için gerekli middleware
app.use(express.json());

// OpenAPI tasarımına uygun olarak tüm API rotalarımızı '/api' altına koyuyoruz
// Yani senin rotan otomatik olarak '/api/posts' haline gelecek
app.use('/api', routes);

module.exports = app;