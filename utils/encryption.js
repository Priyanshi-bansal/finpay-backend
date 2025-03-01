const crypto = require('crypto');

// Function to encrypt data using AES-256-ECB
const encrypt = (text, key) => {
    // Ensure the key is 32 bytes (64 hex characters) and buffer from hexadecimal
    const keyBuffer = Buffer.from(key, 'hex');

    if (keyBuffer.length !== 32) {
        throw new Error('Invalid key length. AES-256 requires a 32-byte key.');
    }

    // Create a cipher object in ECB mode (no IV needed for ECB mode)
    const cipher = crypto.createCipheriv('aes-256-ecb', keyBuffer, null);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

// Function to decrypt data using AES-256-ECB
const decrypt = (encryptedText, key) => {
    // Ensure the key is 32 bytes (64 hex characters) and buffer from hexadecimal
    const keyBuffer = Buffer.from(key, 'hex');

    if (keyBuffer.length !== 32) {
        throw new Error('Invalid key length. AES-256 requires a 32-byte key.');
    }

    // Create a decipher object in ECB mode (no IV needed for ECB mode)
    const decipher = crypto.createDecipheriv('aes-256-ecb', keyBuffer, null);

    // Decrypt the text
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = { encrypt, decrypt };
