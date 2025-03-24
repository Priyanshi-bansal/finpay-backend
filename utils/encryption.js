const crypto = require('crypto');

const workingKey = process.env.ENCRYPTION_KEY || "6743D700ED335785E47D882027B283C0";


function encrypt(text, key) {
    // Ensure the key is 16 bytes (128 bits) long for AES-128
    const keyBuffer = Buffer.from(key, 'utf8').slice(0, 16);

    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(16);

    // Create a cipher instance
    const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return the IV and encrypted data as a base64-encoded string
    return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(encryptedText, key) {
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

// Example usage
const billerData = JSON.stringify({ "billerId": ["OTME00005XXZ43"] });
const encryptedBillerData = encrypt(billerData, workingKey);
console.log("Encrypted Biller Data:", encryptedBillerData);

const decryptedBillerData = decrypt(encryptedBillerData, workingKey);
console.log("Decrypted Biller Data:", decryptedBillerData);

 module.exports = { encrypt, decrypt };
