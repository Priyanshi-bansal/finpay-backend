const mongoose = require("mongoose");
require("dotenv").config();
const Merchant = require("./models/merchantModel"); // Import Merchant model
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const queryRoute = require("./routes/queryRoute");
const planRoute = require("./routes/planRoute");
const rechargeRoute = require("./routes/rechargeRoute");
// const loggerMiddleware = require("./middleware/loggerMiddleware");
const creditBillRoute = require("./routes/creditbillRoutes");
const OpLogoRoutes = require("./routes/OpLogoRoutes");
const billerRoutes = require("./routes/bbps/billerRoutes");
const KycRoutes = require("./routes/kycRoutes");
const servicePlanRoutes = require("./routes/servicePlanRoutes");

//admin routes
const adminRoutes=require("./routes/admin/adminUserRoutes")


const app = express();
app.use(cors());
// app.use(cors({origin:"http://localhost:3000"}))

app.use(bodyParser.json());

// Register Routes
// app.use(loggerMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/query", queryRoute);
app.use("/api/plan", planRoute);
app.use("/api/recharge",rechargeRoute);
app.use("/api/creditbill", creditBillRoute);
app.use("/api/oplogo",OpLogoRoutes);
app.use("/api/biller", billerRoutes);
app.use("/api/kyc",KycRoutes);
app.use("/api/service/plans", servicePlanRoutes);

  // admin 
  app.use("/api/admin",adminRoutes)


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
