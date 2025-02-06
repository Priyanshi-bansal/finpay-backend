const jwt = require("jsonwebtoken");

const generateJwtToken = (userId) => {
  try {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate token");
  }
};

module.exports = { generateJwtToken };
