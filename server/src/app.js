const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const redis = require('redis');

const app = express();

// --- REDIS YAPILANDIRMASI (EN ÜSTE ALINDI) ---
const redisClient = redis.createClient({
  // Render'daki REDIS_URL'i kullanır, yoksa hata almamak için log bırakır
  url: process.env.REDIS_URL 
});

redisClient.on('error', err => console.error('❌ Redis Client Hatası:', err));

// Bağlantıyı asenkron olarak başlatan fonksiyon
(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis Buluta Bağlandı");
    }
  } catch (err) {
    console.error("❌ Redis Bağlantı Kurulamadı:", err);
  }
})();

// 1. Global Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`🚀 [RADAR] İstek Geldi: ${req.method} ${req.url}`);
    next();
});

/* 2. Swagger Setup */
try {
    const swaggerDocument = YAML.load("../CampifyAPI.yaml");
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.log("Swagger dosyası yüklenirken hata oluştu.");
}

/* 3. Routes */
app.use("/v1/auth", require("./routes/authRoutes"));
app.use("/v1/users", require("./routes/userRoutes"));
app.use("/v1/profile", require("./routes/userRoutes"));
app.use('/v1/teams', require('./routes/teamRoutes'));

// Redis Test Rotası
app.get("/v1/test-redis", async (req, res) => {
  try {
    if (!redisClient.isOpen) {
      return res.status(500).json({ success: false, message: "Redis bağlantısı şu an kapalı." });
    }
    
    await redisClient.set("campify_status", "Suleyman Demirel Universitesi - Redis Aktif!");
    const value = await redisClient.get("campify_status");
    
    res.status(200).json({
      success: true,
      message: "Redis bağlantısı başarılı!",
      data: value
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Redis işlem hatası: " + err.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("Campify API is running!");
});

/* 4. Error Handling */
app.use(require('./middleware/errorMiddleware'));

/* 5. MongoDB Connection & Server Start */
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/campify";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
  });

module.exports = app;