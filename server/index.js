require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Redis ve RabbitMQ entegrasyonu
const { connectRedis } = require('./src/config/redis');
const { connectRabbitMQ } = require('./src/config/rabbitmq');

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));


// --- GÜVENLIK VE BAGLANTI AYARI ---
const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    // Zaten bagliysa tekrar deneme
    if (mongoose.connection.readyState >= 1) return;

    // Degisken bos mu kontrolu
    if (!dbURI) {
        throw new Error("MONGODB_URI degiskeni tanimlanmamis! Settings > Environment Variables kismina eklemelisin.");
    }

    try {
        await mongoose.connect(dbURI, { 
            serverSelectionTimeoutMS: 10000 // 10 saniye bekle
        });
        console.log('MongoDB Baglantisi Basarili!');
    } catch (err) {
        // Hata turune gore detay verelim
        if (err.message.includes('Invalid scheme')) {
            throw new Error("Link formati hatali! Link 'mongodb+srv://' ile baslamali.");
        }
        throw err;
    }
};

// --- Redis ve RabbitMQ Baslat ---
connectRedis();
connectRabbitMQ();

// --- HATA YAKALAYICI ---
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({
            durum: "Veritabani Hatasi",
            mesaj: err.message,
            ipucu: "MONGODB_URI degerini kontrol et."
        });
    }
});

// --- ROTALAR ---
app.get('/', (req, res) => res.send("Campify API Safe & Running!"));

// Sistem durumu endpoint'i (Redis, RabbitMQ, MongoDB durum kontrolu)
const { isRedisAvailable } = require('./src/config/redis');
const { isRabbitMQAvailable } = require('./src/config/rabbitmq');

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        services: {
            mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            redis: isRedisAvailable() ? 'connected' : 'disconnected',
            rabbitmq: isRabbitMQAvailable() ? 'connected' : 'disconnected',
        },
        timestamp: new Date().toISOString(),
    });
});

const commentRoutes = require('./src/routes/commentRoutes');
app.use('/api/comments', commentRoutes);

const chatRoutes = require('./src/routes/chatRoutes');
app.use('/api/chat', chatRoutes);

const postRoutes = require('./src/routes/postRoutes');
app.use('/api/posts', postRoutes);

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./src/routes/userRoutes');
app.use('/api/user', userRoutes);



module.exports = app;
