const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

// 1. Global Middlewares
app.use(cors());
app.use(express.json());

// Gelen tüm istekleri terminale yazdıran radar
app.use((req, res, next) => {
    console.log(`🚀 [RADAR] İstek Geldi: ${req.method} ${req.url}`);
    next();
});

/* 2. Swagger Setup */
try {
    const swaggerDocument = YAML.load("../CampifyAPI.yaml");
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.log("Swagger dosyası yüklenirken hata oluştu, ama server devam ediyor.");
}

/* 3. Routes */
app.use("/v1/auth", require("./routes/authRoutes"));
app.use("/v1/users", require("./routes/userRoutes"));
app.use("/v1/profile", require("./routes/userRoutes"));
app.use('/v1/teams', require('./routes/teamRoutes'));

/* 4. Test route */
app.get("/", (req, res) => {
  res.send("Campify API is running!");
});

/* 5. Error Handling */
// Hata yakalayıcı her zaman rotalardan sonra gelmelidir
app.use(require('./middleware/errorMiddleware'));

/* 6. MongoDB Connection & Server Start */
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/campify";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
  });

module.exports = app;