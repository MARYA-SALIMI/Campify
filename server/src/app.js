const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* Swagger Setup */
const swaggerDocument = YAML.load("../CampifyAPI.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));



/* Routes */
app.use("/v1/auth", authRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/profile", userRoutes);

/* Test route */
app.get("/", (req, res) => {
  res.send("Campify API is running!");
});

/* MongoDB connection */
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/campify")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

/* Server start */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});