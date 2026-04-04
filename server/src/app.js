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

// Gelen tüm istekleri terminale yazdıran radar (Senin eklediğin kısım)
app.use((req, res, next) => {
    console.log(`🚀 [RADAR] İstek Geldi: ${req.method} ${req.url}`);
    next();
});

/* 2. Swagger Setup */
const swaggerDocument = YAML.load("../CampifyAPI.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* 3. Routes */
// Arkadaşının rotaları
app.use("/v1/auth", require("./routes/authRoutes"));
app.use("/v1/users", require("./routes/userRoutes"));
app.use("/v1/profile", require("./routes/userRoutes"));

// Senin rotan (Teams kısmı)
app.use('/v1/teams', require('./routes/teamRoutes'));

/* 4. Test route */
app.get("/", (req, res) => {
  res.send("Campify API is running!");
});

/* 5. Error Handling (Senin eklediğin middleware) */
// Not: Hata handler her zaman tüm rotalardan SONRA tanımlanmalıdır.
app.use(require('./middleware/errorMiddleware'));

/* 6. MongoDB connection & Server Start */
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/campify")
.then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
})
.catch(err => console.error("MongoDB Connection Error:", err));

module.exports = app;