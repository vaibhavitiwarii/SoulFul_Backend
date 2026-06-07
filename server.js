const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors({
  origin: ["https://admin.soulfulindiatour.com", "https://www.soulfulindiatour.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


require('./src/app');