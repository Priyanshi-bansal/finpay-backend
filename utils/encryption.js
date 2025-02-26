
const crypto = require("crypto");

// Ensure key is exactly 16 bytes
const getKey = (key) => {
  if (!key) {
    throw new Error("Encryption Key is missing!");
  }
  return key.length === 16 ? key : key.padEnd(16, "0").slice(0, 16);
};

// AES-128 Encryption
const encryptData = (data, key) => {
  if (!data) {
    throw new Error("Data to encrypt is missing!");
  }
  console.log("Encrypting data:", data);
  const encryptionKey = getKey(key);
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(encryptionKey), Buffer.alloc(16, 0));
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// AES-128 Decryption
const decryptData = (encryptedData, key) => {
  if (!encryptedData) {
    throw new Error("Data to decrypt is missing!");
  }
  console.log("Decrypting data:", encryptedData);
  const decryptionKey = getKey(key);
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(decryptionKey), Buffer.alloc(16, 0));
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encryptData, decryptData };