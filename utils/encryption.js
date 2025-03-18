const crypto = require('crypto');

// Define the encryption and decryption functions
const encrypt = (text, key) => {
    // Ensure the key is 16 bytes (128 bits) long for AES-128
    const keyBuffer = Buffer.from(key, 'utf8').slice(0, 16);

    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(16);

    // Create a cipher instance
    const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, iv);

    // Encrypt the data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return the IV and encrypted data as a base64-encoded string
    return `${iv.toString('hex')}:${encrypted}`;
}

const decrypt = (encryptedText, key) => {
    // Ensure the key is 16 bytes (128 bits) long for AES-128
    const keyBuffer = Buffer.from(key, 'utf8').slice(0, 16);

    // Split the IV and encrypted data
    const [ivHex, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    // Create a decipher instance
    const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, iv);

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}




module.exports = {encrypt, decrypt}

