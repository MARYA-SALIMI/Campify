const express = require('express');

const cors = require('cors');

const app = express();



app.use(cors());

app.use(express.json());

// Gelen tüm istekleri terminale yazdıran radar

app.use((req, res, next) => {

    console.log(`🚀 [RADAR] İstek Geldi: ${req.method} ${req.url}`);

    next();

});

// Routes

app.use('/v1/teams', require('./routes/teamRoutes'));  //benim kısmım

// Global hata handler

app.use(require('./middleware/errorMiddleware'));



module.exports = app;