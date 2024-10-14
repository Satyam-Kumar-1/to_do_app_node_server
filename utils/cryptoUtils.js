const CryptoJS = require('crypto-js');

const secretKey = process.env.JWT_SECRET;

// Encryption function
const encrypt = (text) => {
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
    return ciphertext;
};

// Decryption function
const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

module.exports = { encrypt, decrypt };
