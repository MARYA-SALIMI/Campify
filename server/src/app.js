const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/auth', require('./routes/authRoutes'));
app.use('/v1/users', require('./routes/userRoutes'));
app.use('/v1/api/posts', require('./routes/postRoutes'));
app.use('/v1/api/chats', require('./routes/chatRoutes'));
app.use('/v1/teams', require('./routes/teamRoutes'));  //benim kısmım
app.use('/v1/posts', require('./routes/commentRoutes'));

// Global hata handler
app.use(require('./middlewares/errorHandler'));

module.exports = app;