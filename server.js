const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "https://admin.soulfulindiatour.com",
  "https://www.soulfulindiatour.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Handle preflight requests
app.options("*", cors());

require('./src/app');