const axios = require("axios");
const { encrypt, decrypt } = require("../../utils/encryption");
const crypto = require("crypto");

const workingKey = process.env.ENCRYPTION_KEY;
const BBPS_API_URL = process.env.BBPS_API_URL;
const ACCESS_CODE = process.env.ACCESS_CODE;

// ✅ Generate unique requestId in required format
function generateRequestId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart = "";
  for (let i = 0; i < 27; i++) {
    randomPart += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  const now = new Date();
  const year = now.getFullYear() % 10;
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const requestId = `${randomPart}${year}${dayOfYear
    .toString()
    .padStart(3, "0")}${hours}${minutes}`;
  return requestId;
}

// ✅ Encrypted API (biller-info-enc)
const billerInfo = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    // ✅ Parse raw string to JSON if coming as raw text
    const requestBody = JSON.parse(req.body);
    if (!requestBody.billerId || !Array.isArray(requestBody.billerId)) {
      return res.status(400).json({ error: "Invalid billerId format" });
    }

    const billerData = JSON.stringify(requestBody);
    console.log("Validated Request Data:", billerData);

    // ✅ Encrypt stringified data
    const encryptedData = encrypt(billerData, workingKey);
    console.log("Encrypted Data:", encryptedData);

    // ✅ Send encrypted data to BBPS API
    const bbpsResponse = await axios.post(
      "https://stgapi.billavenue.com/billpay/extMdmCntrl/mdmRequestNew/json",
      encryptedData,
      {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          accessCode: ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data) {
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

    // ✅ Decrypt response data
    const decryptedData = decrypt(bbpsResponse.data, workingKey);
    console.log("Decrypted Data:", decryptedData);
    res.json(JSON.parse(decryptedData));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const billFetch = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    const requestBody = JSON.parse(req.body);

    const billerData = JSON.stringify(requestBody);
    console.log("Validated Request Data:", billerData);

    // ✅ Encrypt stringified data
    const encryptedData = encrypt(billerData, workingKey);
    console.log("Encrypted Data:", encryptedData);

    // ✅ Send encrypted data to BBPS API
    const bbpsResponse = await axios.post(
      "https://stgapi.billavenue.com/billpay/extBillCntrl/billFetchRequest/json",
      {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          accessCode: ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
          encRequest: encryptedData,
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data) {
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

    // ✅ Decrypt response data
    const decryptedData = decrypt(bbpsResponse.data, workingKey);
    console.log("Decrypted Data:", decryptedData);
    res.json(JSON.parse(decryptedData));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const billpayment = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    // ✅ Parse raw string to JSON if coming as raw text
    const requestBody = JSON.parse(req.body);

    const billerData = JSON.stringify(requestBody);
    console.log("Validated Request Data:", billerData);

    // ✅ Encrypt stringified data
    const encryptedData = encrypt(billerData, workingKey);
    console.log("Encrypted Data:", encryptedData);

    // ✅ Send encrypted data to BBPS API
    const bbpsResponse = await axios.post(
      "https://stgapi.billavenue.com/billpay/extBillPayCntrl/billPayRequest/json",
      {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          accessCode: ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
          encRequest: encryptedData,
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data) {
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

    // ✅ Decrypt response data
    const decryptedData = decrypt(bbpsResponse.data, workingKey);
    console.log("Decrypted Data:", decryptedData);
    res.json(JSON.parse(decryptedData));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const transactionstatus = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    // ✅ Parse raw string to JSON if coming as raw text
    const requestBody = JSON.parse(req.body);
    if (!requestBody.billerId || !Array.isArray(requestBody.billerId)) {
      return res.status(400).json({ error: "Invalid billerId format" });
    }

    const billerData = JSON.stringify(requestBody);
    console.log("Validated Request Data:", billerData);

    // ✅ Encrypt stringified data
    const encryptedData = encrypt(billerData, workingKey);
    console.log("Encrypted Data:", encryptedData);

    // ✅ Send encrypted data to BBPS API
    const bbpsResponse = await axios.post(
      "https://stgapi.billavenue.com/billpay/transactionStatus/fetchInfo/json",
      {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          accessCode: ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
          encRequest: encryptedData,
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data) {
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

    // ✅ Decrypt response data
    const decryptedData = decrypt(bbpsResponse.data, workingKey);
    console.log("Decrypted Data:", decryptedData);
    res.json(JSON.parse(decryptedData));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const complaintregistration = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    // ✅ Parse raw string to JSON if coming as raw text
    const requestBody = JSON.parse(req.body);
    if (!requestBody.billerId || !Array.isArray(requestBody.billerId)) {
      return res.status(400).json({ error: "Invalid billerId format" });
    }

    const billerData = JSON.stringify(requestBody);
    console.log("Validated Request Data:", billerData);

    // ✅ Encrypt stringified data
    const encryptedData = encrypt(billerData, workingKey);
    console.log("Encrypted Data:", encryptedData);

    // ✅ Send encrypted data to BBPS API
    const bbpsResponse = await axios.post(
      "https://stgapi.billavenue.com/billpay/extComplaints/register/json",
      {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          accessCode: ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
          encRequest: encryptedData,
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data) {
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

    // ✅ Decrypt response data
    const decryptedData = decrypt(bbpsResponse.data, workingKey);
    console.log("Decrypted Data:", decryptedData);
    res.json(JSON.parse(decryptedData));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const complainttracking = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    // ✅ Parse raw string to JSON if coming as raw text
    const requestBody = JSON.parse(req.body);
    if (!requestBody.billerId || !Array.isArray(requestBody.billerId)) {
      return res.status(400).json({ error: "Invalid billerId format" });
    }

    const billerData = JSON.stringify(requestBody);
    console.log("Validated Request Data:", billerData);

    // ✅ Encrypt stringified data
    const encryptedData = encrypt(billerData, workingKey);
    console.log("Encrypted Data:", encryptedData);

    // ✅ Send encrypted data to BBPS API
    const bbpsResponse = await axios.post(
      "https://stgapi.billavenue.com/billpay/extComplaints/track/json",

      {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          accessCode: ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
          encRequest: encryptedData,
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data) {
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

    // ✅ Decrypt response data
    const decryptedData = decrypt(bbpsResponse.data, workingKey);
    console.log("Decrypted Data:", decryptedData);
    res.json(JSON.parse(decryptedData));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const billvalidation = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    // ✅ Parse raw string to JSON if coming as raw text
    const requestBody = JSON.parse(req.body);
    if (!requestBody.billerId || !Array.isArray(requestBody.billerId)) {
      return res.status(400).json({ error: "Invalid billerId format" });
    }

    const billerData = JSON.stringify(requestBody);
    console.log("Validated Request Data:", billerData);

    // ✅ Encrypt stringified data
    const encryptedData = encrypt(billerData, workingKey);
    console.log("Encrypted Data:", encryptedData);

    // ✅ Send encrypted data to BBPS API
    const bbpsResponse = await axios.post(
      "https://stgapi.billavenue.com/billpay/extBillValCntrl/billValidationRequest/json",

      {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          accessCode: ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
          encRequest: encryptedData,
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data) {
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

    // ✅ Decrypt response data
    const decryptedData = decrypt(bbpsResponse.data, workingKey);
    console.log("Decrypted Data:", decryptedData);
    res.json(JSON.parse(decryptedData));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const plan = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    // ✅ Parse raw string to JSON if coming as raw text
    const requestBody = JSON.parse(req.body);
    if (!requestBody.billerId || !Array.isArray(requestBody.billerId)) {
      return res.status(400).json({ error: "Invalid billerId format" });
    }

    const billerData = JSON.stringify(requestBody);
    console.log("Validated Request Data:", billerData);

    // ✅ Encrypt stringified data
    const encryptedData = encrypt(billerData, workingKey);
    console.log("Encrypted Data:", encryptedData);

    // ✅ Send encrypted data to BBPS API
    const bbpsResponse = await axios.post(
      "https://stgapi.billavenue.com/billpay/extPlanMDM/planMdmRequest/json",

      {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          accessCode: ACCESS_CODE,
          requestId: generateRequestId(),
          ver: "1.0",
          instituteId: "FP09",
          encRequest: encryptedData,
        },
      }
    );

    console.log("BBPS Response:", bbpsResponse.data);

    if (!bbpsResponse.data) {
      return res.status(400).json({ error: "Invalid response from BBPS API" });
    }

    // ✅ Decrypt response data
    const decryptedData = decrypt(bbpsResponse.data, workingKey);
    console.log("Decrypted Data:", decryptedData);
    res.json(JSON.parse(decryptedData));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  billerInfo,
  billFetch,
  billpayment,
  transactionstatus,
  complaintregistration,
  complainttracking,
  billvalidation,
  plan,
};
