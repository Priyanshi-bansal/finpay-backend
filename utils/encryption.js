const crypto = require('crypto');

const workingKey = process.env.ENCRYPTION_KEY || "6743D700ED335785E47D882027B283C0";
const ivHex = "a3f1d5e2b4c7f8a6d9e1b3c5f2e8d7a1"; // Hardcoded IV for encryption and decryption

function encrypt(text, key) {
    // Ensure the key is 16 bytes (128 bits) long for AES-128
    const keyBuffer = Buffer.from(key, 'utf8').slice(0, 16);

    // Convert IV from hex to Buffer
    const iv = Buffer.from(ivHex, 'hex');

    // Create a cipher instance
    const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, iv);

    // Encrypt the data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return only the encrypted data
    return encrypted;
}

function decrypt(encryptedText, key) {
    // Ensure the key is 16 bytes (128 bits) long for AES-128
    const keyBuffer = Buffer.from(key, 'utf8').slice(0, 16);

    // Convert IV from hex to Buffer
    const iv = Buffer.from(ivHex, 'hex');

    // Create a decipher instance
    const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, iv);

    // Decrypt the data
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// Example usage
const billerData = JSON.stringify({ "billerId": ["OTME00005XXZ43"] });
const encryptedBillerData = encrypt(billerData, workingKey);
console.log("Encrypted Biller Data:", encryptedBillerData);

const decryptedBillerData = decrypt(encryptedBillerData, workingKey);
console.log("Decrypted Biller Data:", decryptedBillerData);

module.exports = { encrypt, decrypt };
