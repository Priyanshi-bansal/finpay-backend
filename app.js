const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");

const app = express();

app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);

module.exports = app;
