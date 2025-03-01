const crypto = require('crypto');

// Encryption key (replace with your actual key)
const ENCRYPTION_KEY = 'your_encryption_key_32_bytes_long'; // Must be 32 bytes (64 hex characters)

// Function to encrypt data using AES-256-ECB
const encrypt = (text, key) => {
    // Ensure the key is 32 bytes (64 hex characters)
    const keyBuffer = Buffer.from(key, 'hex');

    // Create a cipher object
    const cipher = crypto.createCipheriv('aes-256-ecb', keyBuffer, null);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

// JSON data to encrypt
const jsonString = JSON.stringify({ billerId: ["DUMMY0000DIG08"] });

// Encrypt the JSON string
const encryptedOutput = encrypt(jsonString, ENCRYPTION_KEY);


// Function to decrypt data using AES-256-ECB
const decrypt = (encryptedText, key) => {
    // Ensure the key is 32 bytes (64 hex characters)
    const keyBuffer = Buffer.from(key, 'hex');

    // Create a decipher object
    const decipher = crypto.createDecipheriv('aes-256-ecb', keyBuffer, null);

    // Decrypt the text
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}




module.exports = {encrypt, decrypt}