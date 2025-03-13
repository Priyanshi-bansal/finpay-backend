const crypto = require('crypto');

const workingKey = process.env.ENCRYPTION_KEY || "6743D700ED335785E47D882027B283C0";

const initVector = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);

function md5HexToBinary(hexString) {
    return crypto.createHash('md5').update(hexString).digest();
}

function encrypt(plainText, key) {
    const derivedKey = md5HexToBinary(key);
    
    const cipher = crypto.createCipheriv('aes-128-cbc', derivedKey, initVector);
    let encryptedText = cipher.update(plainText, 'utf8', 'hex');
    encryptedText += cipher.final('hex');

    // Return the encrypted text without truncation
    return encryptedText;
}

function decrypt(encryptedText, key) {
    const derivedKey = md5HexToBinary(key);

    try {
        const decipher = crypto.createDecipheriv('aes-128-cbc', derivedKey, initVector);
        decipher.setAutoPadding(true); // Ensure proper padding

        // Decrypt the text
        let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
        decryptedText += decipher.final('utf8');

        return decryptedText;
    } catch (error) {
        console.error("Decryption failed:", error.message);
        return null; // Handle decryption failure properly
    }
}

// Example Data
// const billerData = JSON.stringify({ "billerId": ["AURDG0000DIG01"] });
// const encryptedBillerData = encrypt(billerData, workingKey);
// console.log("Encrypted Biller Data:", encryptedBillerData);

// const decryptedBillerData = decrypt(encryptedBillerData, workingKey);
// console.log("Decrypted Biller Data:", decryptedBillerData);

module.exports = { encrypt, decrypt };
