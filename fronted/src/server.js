const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/api/v1/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Server is healthy and running" });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/multitenant_workflow",
    )
    .then(() => {
      console.log("Connected to MongoDB successfully");
      app.listen(PORT, () =>
        console.log(`Backend server running on port ${PORT}`),
      );
    })
    .catch((err) => console.error("Database connection error:", err));
}

module.exports = app;
