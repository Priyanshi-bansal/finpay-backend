
const axios = require("axios");
const { encrypt, decrypt } = require('../../utils/encryption');
const crypto = require('crypto');

const workingKey = process.env.ENCRYPTION_KEY;
const key = crypto.createHash('md5').update(workingKey).digest();  
const BBPS_API_URL = process.env.BBPS_API_URL;

function generateRequestId() {
  const now = new Date();
  const year = now.getFullYear() % 10; // Last digit of the year
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay); // DDD
  const hours = String(now.getHours()).padStart(2, "0"); // hh (24-hour format)
  const minutes = String(now.getMinutes()).padStart(2, "0"); // mm
  const randomPart = crypto.randomBytes(20).toString("hex").slice(0, 27);
  const timestampPart = `${year}${String(dayOfYear).padStart(3, "0")}${hours}${minutes}`;
  
  return `${randomPart}${timestampPart}`;
}

console.log(generateRequestId());



const billerInfo = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    const { billerId } = req.body;

    if (!billerId) {
      return res.status(400).json({ error: "billerId is required" });
    }

    console.log("Validated Request Data:", { billerId });

    const encryptedData = encrypt(JSON.stringify(billerId), workingKey);



    // const encryptedData = encryptionResponse.data.enc_request;
    console.log("Encrypted Data:", encryptedData);

    // Send request to BBPS API
    const bbpsResponse = await axios.post(
      `https://stgapi.billavenue.com/billpay/extMdmCntrl/mdmRequestNew/json`,
      {
        enc_request: encryptedData,
      },
      {
        params: {
          accessCode: process.env.ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data ) {
      console.error("No encrypted response found in API response.");
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

     res.json(bbpsResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const billerDec = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    const { encryptedData } = req.body;

   
    const decryptedData = decrypt(encryptedData, workingKey);

     res.json(decryptedData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};






module.exports = { billerInfo };