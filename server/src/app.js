const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

// 1. Global Middlewares (Sistemin ayakta kalması için şart)
app.use(cors());
app.use(express.json());

// İstek İzleyici (Hata ayıklarken hayat kurtarır)
app.use((req, res, next) => {
    console.log(`🚀 [RADAR] İstek Geldi: ${req.method} ${req.url}`);
    next();
});

/* 2. Swagger Setup */
try {
    const swaggerDocument = YAML.load("../CampifyAPI.yaml");
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.log("⚠️ Swagger dosyası yüklenirken hata oluştu, sistem devam ediyor.");
}

/* 3. Routes - TÜM SİSTEMİN BİRLEŞTİĞİ YER */

// Senin ve ekibin geri kalanının rotaları (v1 standartı)
app.use("/v1/auth", require("./routes/authRoutes"));
app.use("/v1/users", require("./routes/userRoutes"));
app.use("/v1/profile", require("./routes/userRoutes"));
app.use('/v1/teams', require('./routes/teamRoutes'));

// SİNEM'İN ROTLARI: Sinem 'routesIndex' kullanmıştı. 
// Eğer Sinem yeni bir özellik (örneğin Postlar) eklediyse onu da buraya dahil ediyoruz.
// Not: routesIndex.js içinde ne varsa artık /api prefix'i ile çalışacak.
try {
    const sinemRoutes = require('./routesIndex');
    app.use('/api', sinemRoutes); 
} catch (e) {
    console.log("ℹ️ routesIndex yüklenmedi, v1 rotaları üzerinden devam ediliyor.");
}

/* 4. Test route */
app.get("/", (req, res) => {
  res.send("Campify API is running perfectly!");
});

/* 5. Error Handling (Uygulamanın çökmesini engeller) */
app.use(require('./middleware/errorMiddleware'));

/* 6. MongoDB Connection & Server Start */
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/campify";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    // Server'ın sadece bu dosya çalıştırıldığında başlamasını sağlar
    if (require.main === module) {
        app.listen(PORT, () => {
          console.log(`🚀 Server running on http://localhost:${PORT}`);
          console.log(`📖 Swagger docs at http://localhost:${PORT}/api-docs`);
        });
    }
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Veritabanı yoksa sistemi durdur ki hatalı çalışmasın
  });

module.exports = app;