
// const crypto = require("crypto");

// // Ensure key is exactly 16 bytes
// const getKey = (key) => {
//   if (!key) {
//     throw new Error("Encryption Key is missing!");
//   }
//   return key.length === 16 ? key : key.padEnd(16, "0").slice(0, 16);
// };

// // AES-128 Encryption
// const encryptData = (data, key) => {
//   if (!data) {
//     throw new Error("Data to encrypt is missing!");
//   }
//   // //console.log("Encrypting data:", data);
//   const encryptionKey = getKey(key);
//   const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(encryptionKey), Buffer.alloc(16, 0));
//   let encrypted = cipher.update(data, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// };

// // AES-128 Decryption
// const decryptData = (encryptedData, key) => {
//   if (!encryptedData) {
//     throw new Error("Data to decrypt is missing!");
//   }
//   // //console.log("Decrypting data:", encryptedData);
//   const decryptionKey = getKey(key);
//   const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(decryptionKey), Buffer.alloc(16, 0));
//   let decrypted = decipher.update(encryptedData, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// };

// module.exports = { encryptData, decryptData };

const crypto = require('crypto');


// Encryption function
const encryptData = (plainText, key) => {
    const keyBuffer = Buffer.from(md5(key), 'hex');  // Equivalent to PHP's md5($key)
    const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);

    const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, iv);
    let encryptedText = cipher.update(plainText, 'utf8', 'hex');
    encryptedText += cipher.final('hex');

    return encryptedText;
}

// Decryption function
const decryptData = (encryptedText, key) => {
    const keyBuffer = Buffer.from(md5(key), 'hex');
    const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);

    const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, iv);
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedText += decipher.final('utf8');

    return decryptedText;
}

// MD5 hash function
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}


// // Encrypt data
// const encryptedData = encryptData(merchant_data, working_key);
// console.log("Encrypted Data: ", encryptedData);

// const decryptedData = decryptData(encryptedData, working_key);
// console.log("Decrypted Data: ", decryptedData);

module.exports = { encryptData, decryptData };