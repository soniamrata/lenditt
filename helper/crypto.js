const crypto = require("crypto")
// Encrypt data
function encryptData(data) {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.encryptionKey);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
  }
  
  // Decrypt data
   function decryptData(encryptedData) {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.encryptionKey);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  }
  module.exports={encryptData,decryptData}