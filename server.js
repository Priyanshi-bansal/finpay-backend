const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const Merchant = require("./models/merchantModel"); // Import Merchant model

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
