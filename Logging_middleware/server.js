const express = require("express");
const loggerMiddleware = require("./middleware/logger");
const Log = require("./log");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());
app.use(loggerMiddleware);

// Test Route
app.get("/", (req, res) => {
  Log("backend", "debug", "handler", "Root endpoint accessed");
  res.send("Hello from Logging Middleware!");
});

// Error Route
app.get("/error", (req, res) => {
  try {
    throw new Error("Something failed!");
  } catch (err) {
    Log("backend", "error", "handler", err.message);
    res.status(500).send("Error occurred");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});