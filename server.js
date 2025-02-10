const mongoose = require("mongoose");
require("dotenv").config();
const Merchant = require("./models/merchantModel"); // Import Merchant model
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const cors = require('cors');


const app = express();
app.use(cors());
// app.use(cors({origin:"http://localhost:3000"}))
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/payment",paymentRoutes);

const url = "mongodb://localhost:27017/";
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Ensure a default merchant account exists
    const merchant = await Merchant.findOne();
    if (!merchant) {
      await Merchant.create({ name: "Default Merchant", accountBalance: 0 });
      console.log("Default merchant account created.");
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process on DB connection failure
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
