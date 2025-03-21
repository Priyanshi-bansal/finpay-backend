const crypto = require('crypto');

// ✅ Working Key (same as PHP key)
const workingKey = '6743D700ED335785E47D882027B283C0';

// ✅ Function to convert hex to binary (hextobin equivalent in PHP)
function hexToBin(hexString) {
    return Buffer.from(hexString, 'hex');
}

// ✅ Encryption Function
function encrypt(plainText, key) {
    // Use MD5 hash of the key and convert to binary (16-byte key for AES-128)
    const encryptionKey = hexToBin(crypto.createHash('md5').update(key).digest('hex'));

    // Fixed Initialization Vector (IV) same as PHP
    const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);

    // Create a cipher using AES-128-CBC
    const cipher = crypto.createCipheriv('aes-128-cbc', encryptionKey, iv);

    // Encrypt the plain text
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted.toUpperCase(); // Same as PHP (uppercase hex)
}

// ✅ Decryption Function
function decrypt(encryptedText, key) {
    // Use MD5 hash of the key and convert to binary
    const decryptionKey = hexToBin(crypto.createHash('md5').update(key).digest('hex'));

    // Fixed Initialization Vector (IV)
    const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);

    // Create a decipher using AES-128-CBC
    const decipher = crypto.createDecipheriv('aes-128-cbc', decryptionKey, iv);

    // Decrypt the encrypted text
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// ✅ Example Usage

const billerData = JSON.stringify("Hello World");
console.log("➡️ Original Biller Data:", billerData);

// // Encrypt the data
const encryptedBillerData = encrypt(billerData, workingKey);
console.log("🔐 Encrypted Biller Data:", encryptedBillerData);

// Decrypt the data
try {
    const decryptedBillerData = decrypt("7D456C6B5890D3F0324D0C92109A6373DD54FC30F08DD44F707813183846F9E61C57A94682B0889E895E65D2B6E1C3580B1691B7E2EBD6B38C88BF45EE4BFD7440C8CDE8CB3CBF357C4A43D4C6DC1CC67FAE6C50FA16C0E36E75B83BEBC60781D596F1969FC3D50567C3D07DE1BE02B2AEB211C34FAA8674AFE39FC442BAF70833EBBB39F25B4C259AFA6D123BD56D2F41755529D9D01B6E3DD061265608705EE189C3A300F38AE4324F6064043E0BFE847CB9435456B03FC554B968FC2A23BC8D91162D37C3458BD509F6D162B7496463E1C8BA61448FCCC43E118194F47073C75BECF2046A5BBE3D596693FBEEE78EB546DD70FEA8621D7D5219FD23E2FEF0544D3E5E9F113C60C68AE5CD120530DF9B48EEECD30556831A00B8A91A634CA628EB20076C13AEC4EDB1A09FCCCD57E6CCFBC8E3F503C3CCC1BC806041B243BAF4B1ECF03FE30E0E7F1BC97691007B800CB2AA16FA9D53693CFCE7C853CDD0A4235D1F64425167928D56FA931F5728AE087F19C3D72EB743162F5E40FF004B50703CCC0F4ACEE77D82C850739F55E34C2C8644F6AF0344946E44D6D12A4E7B221AC91E24D04FB78454C5988F3F70CCDA820DFC4FC456EF050C75F5DCA95599F192E8312DD890F1DE4379A4871F53704531CC37DFD98A85D9C987B630908D2430", workingKey);

    console.log("🔓 Decrypted Biller Data:", decryptedBillerData);
} catch (error) {
    console.error("❌ Decryption Failed:", error.message);
}

// ✅ Export encryption and decryption functions
module.exports = { encrypt, decrypt };