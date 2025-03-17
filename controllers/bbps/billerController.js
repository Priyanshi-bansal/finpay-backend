
const axios = require("axios");
const { encrypt, decrypt } = require('../../utils/encryption');
const crypto = require('crypto');

const workingKey = process.env.ENCRYPTION_KEY;
const key = crypto.createHash('md5').update(workingKey).digest();  
const BBPS_API_URL = process.env.BBPS_API_URL;

function generateRequestId() {
  
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomPart = '';
  for (let i = 0; i < 27; i++) {
      randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }

 
  const now = new Date();
  const year = now.getFullYear() % 10; 
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay); 

  const hours = now.getHours().toString().padStart(2, '0'); 
  const minutes = now.getMinutes().toString().padStart(2, '0'); 

 
  const requestId = `${randomPart}${year}${dayOfYear.toString().padStart(3, '0')}${hours}${minutes}`;
  
  return requestId;
}


// console.log(generateRequestId()); 




const billerInfo = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body); 

  
    if (!req.body || req.body.trim() === "") {
      return res.status(400).json({ error: "billerId is required" });
    }

    const billerId = req.body.trim(); 

    console.log("Validated Request Data:", billerId);

    const encryptedData = encrypt(billerId, workingKey);
    console.log("Encrypted Data:", encryptedData);

    
    const bbpsResponse = await axios.post(
      `https://stgapi.billavenue.com/billpay/extMdmCntrl/mdmRequestNew/json`,
      encryptedData, 
      {
        headers: {
          "Content-Type": "text/plain", 
        },
        params: {
          accessCode: process.env.ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data) {
      console.error("No response received from BBPS API.");
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

    res.send(bbpsResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { billerInfo };

