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

module.exports = { encryptData, decryptData };