const crypto = require('crypto');

// Encryption key and IV
const workingKey = process.env.ENCRYPTION_KEY || "6743D700ED335785E47D882027B283C0";
const ivHex = "a3f1d5e2b4c7f8a6d9e1b3c5f2e8d7a1";

// Convert IV from hex to Buffer
const iv = Buffer.from(ivHex, 'hex');

function encrypt(text, key) {
    // Ensure the key is 16 bytes (128 bits) long
    const keyBuffer = Buffer.from(key, 'utf8').slice(0, 16);

    // Create a cipher instance
    const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, iv);

    // Encrypt the data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return encrypted data
    return encrypted;
}

function decrypt(encryptedText, key) {
    // Ensure the key is 16 bytes (128 bits) long
    const keyBuffer = Buffer.from(key, 'utf8').slice(0, 16);
    console.log("keyBuffer", keyBuffer);
    // Create a decipher instance
    const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, iv);
    console.log("decipher", decipher);
    // Decrypt the data
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log("decrypted", decrypted);
    return decrypted;
}

// Example usage
const billerData = JSON.stringify({ "billerId": ["OTME00005XXZ43"] });
const encryptedBillerData = encrypt(billerData, workingKey);
console.log("Encrypted Biller Data:", encryptedBillerData);

try {
    const decryptedBillerData = decrypt(encryptedBillerData, workingKey);
    console.log("Decrypted Biller Data:", decryptedBillerData);
} catch (error) {
    console.error("Decryption Failed:", error.message);
}

module.exports = { encrypt, decrypt };
