const crypto = require('crypto');

// Function to encrypt the plainText using AES-128-CBC
const encrypt = (plainText, key) => {
    const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);  // IV (same as PHP)
    
    // Create cipher instance using AES-128-CBC
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    
    // Encrypt the plainText and return as hex
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return in uppercase as in PHP code
    return encrypted.toUpperCase();
}

// Function to decrypt the encryptedText using AES-128-CBC
const decrypt = (encryptedText, key) => {
    const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);  // IV (same as PHP)
    
    // Create decipher instance using AES-128-CBC
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    
    // Decrypt the encryptedText and return the original text
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

// Function to convert hex to binary (similar to PHP's hextobin function)
function hextobin(hexString) {
    let binString = '';
    for (let i = 0; i < hexString.length; i += 2) {
        binString += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
    }
    return binString;
}




// // Encrypt the plainText
// const encryptedText = encrypt(plainText, key);
// console.log('Encrypted Text:', encryptedText);  // Encrypted text in uppercase (same as PHP)

// // Decrypt the encryptedText
// const decryptedText = decrypt(encryptedText, key);
// console.log('Decrypted Text:', decryptedText);  // Decrypted text (should match plainText)
