require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));


// --- GÜVENLİK VE BAĞLANTI AYARI ---
const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    // Zaten bağlıysak tekrar deneme
    if (mongoose.connection.readyState >= 1) return;

    // Değişken boş mu kontrolü
    if (!dbURI) {
        throw new Error("MONGODB_URI değişkeni Vercel'de tanımlanmamış! Settings > Environment Variables kısmına eklemelisin.");
    }

    try {
        await mongoose.connect(dbURI, { 
            serverSelectionTimeoutMS: 10000 // 10 saniye bekle
        });
        console.log('MongoDB Bağlantısı Başarılı! 🚀');
    } catch (err) {
        // Hata türüne göre detay verelim
        if (err.message.includes('Invalid scheme')) {
            throw new Error("Link formatı hatalı! Link 'mongodb+srv://' ile başlamalı. Başına tırnak veya boşluk koymadığından emin ol.");
        }
        throw err;
    }
};

// --- HATA YAKALAYICI (POSTMAN'DE GÖRECEĞİN KISIM) ---
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({
            durum: "Veritabanı Hatası",
            mesaj: err.message,
            ipucu: "Vercel panelindeki MONGODB_URI değerini kontrol et ve tekrar 'Redeploy' yap."
        });
    }
});

// --- ROTALAR ---
app.get('/', (req, res) => res.send("Campify API Safe & Running! 🚀"));

const commentRoutes = require('./src/routes/commentRoutes');
app.use('/api/comments', commentRoutes);

const chatRoutes = require('./src/routes/chatRoutes');
app.use('/api/chat', chatRoutes);

const postRoutes = require('./src/routes/postRoutes');
app.use('/api', postRoutes);

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./src/routes/userRoutes');
app.use('/api/user', userRoutes);



module.exports = app;