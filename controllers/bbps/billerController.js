const express = require("express");
const axios = require("axios");
const { encryptData, decryptData } = require("../../utils/encryption");

const router = express.Router();
const BBPS_API_URL = process.env.BBPS_API_URL;

// 🔹 Biller Info Fetch API
const billerInfo = async (req, res) => {
  console.log("Received Request Body:", req.body);

  const { billerId } = req.body;

  // Validate input
  if (!billerId || !Array.isArray(billerId) || billerId.length === 0) {
    return res
      .status(400)
      .json({ error: "Biller ID must be a non-empty array." });
  }

  console.log("Validated Request Data:", { billerId });

  // Encrypt data
  const encryptedData = encryptData(
    JSON.stringify({ billerId }),
    process.env.ENCRYPTION_KEY
  );
  console.log("Encrypted Data:", encryptedData);

  try {
    // Send request to BBPS API
    const response = await axios.post(
      `${BBPS_API_URL}/extMdmCntrl/mdmRequestNew/json`,
      {
        enc_request: encryptedData,
        access_code: process.env.ACCESS_CODE,
        command: "BILLER_INFO",
        request_type: "JSON",
        response_type: "JSON",
        version: "1.1",
      }
    );

    console.log("BBPS Response:", response.data);

    // Decrypt response
    const decryptedResponse = decryptData(
      response.data.enc_response,
      process.env.ENCRYPTION_KEY
    );
    console.log("sdfghjkl",decryptedResponse)
    res.json(JSON.parse(decryptedResponse));
  } catch (error) {
    console.error("Error sedrfghjkghj:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const billFetch = async (req, res) => {
  try {
    const data = axios.post(
      "https://stgapi.billavenue.com/billpay/extBillCntrl/billFetchRequest/json",
      {
        agentId: "CC01CC01513515340681",
        billerAdhoc: false,
        agentDeviceInfo: {
          ip: "192.168.2.183",
          initChannel: "INT",
          mac: "01-23-45-67-89-ab",
        },
        customerInfo: {
          customerMobile: 9892506507,
          customerEmail: "kishor.anand@avenues.info",
          customerAdhaar: 548550008000,
          customerPan: "",
        },
        billerId: "HPCL00000NAT01",
        inputParams: {
          input: [
            { paramName: "Consumer Number", paramValue: 90883000 },
            { paramName: "Distributor ID", paramValue: 13645300 },
          ],
        },
      }
    );
  } catch (error) {
    console.error("Error in bill fetch:", error.message);
    res.status(500).json({ error: error.message });
  }
};



module.exports = { billerInfo, billFetch };
