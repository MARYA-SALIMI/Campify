const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Örnek route
app.get("/", (req, res) => {
  res.send("Campify Backend Çalışıyor 🚀");
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));