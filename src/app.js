require("dotenv").config();
const express = require("express");
const connectDB = require("./config/connect");

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.get("", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
