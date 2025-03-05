
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

    // // Encrypt data using external API
    // const encryptionResponse = await axios.post(
    //   `https://api.worldpayme.com/api/encrypt`,
    //   {
    //     merchant_data: JSON.stringify(billerId),
    //   }
    // );

    // if (!encryptionResponse.data || !encryptionResponse.data.enc_request) {
    //   console.error("Encryption API error:", encryptionResponse.data);
    //   return res.status(500).json({ error: "Encryption failed" });
    // }

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
          requestId: "98745632112345678998745632112345678",
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

    // // Decrypt response using external API
    // const decryptionResponse = await axios.post(
    //   `https://api.worldpayme.com/api/decrypt`,
    //   {
    //     enc_response: bbpsResponse.data.enc_response,
    //   }
    // );

    // if (!decryptionResponse.data || !decryptionResponse.data.decryptedText) {
    //   console.error("Decryption API error:", decryptionResponse.data);
    //   return res.status(500).json({ error: "Decryption failed" });
    // }
    // const decryptedText = decrypt(encryptedData, workingKey);
    // console.log("Decrypted Response:", decryptionResponse.data.decryptedText);

     res.json(bbpsResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
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

const billPayment = async (req, res) => {
  try {
    const data = axios.post(
      "https://stgapi.billavenue.com/billpay/extBillPayCntrl/billPayRequest/json",
      {
        billerAdhoc: "false",
        agentId: "CC01CC01513515340681",
        agentDeviceInfo: {
          initChannel: "AGT",
          ip: "192.168.2.183",
          mac: "01-23-45-67-89-ab",
        },
        customerInfo: {
          customerMobile: "9892506507",
          customerEmail: "kishor.anand@avenues.info",
          customerAdhaar: "548550008000",
          customerPan: "",
        },
        billerId: "HPCL00000NAT01",
        inputParams: {
          input: [
            { paramName: "Consumer Number", paramValue: "90883000" },
            { paramName: "Distributor ID", paramValue: "13645300" },
          ],
        },
        billerResponse: [
          {
            billAmount: "92300",
            billNumber: "1123314338567",
            customerName: "Ramesh Agrawal",
            dueDate: "",
          },
        ],
        additionalInfo: {
          info: [
            { infoName: "Distributor Contact", infoValue: "243306" },
            { infoName: "Distributor Name", infoValue: "Billavenue COMPANY" },
            { infoName: "Consumer Number", infoValue: "90883000" },
            { infoName: "Consumer Address", infoValue: "NA" },
          ],
        },
        amountInfo: { amount: "92300", currency: "356", custConvFee: "0" },
        paymentMethod: {
          paymentMode: "Credit Card",
          quickPay: "N",
          splitPay: "N",
        },
        paymentInfo: {
          info: [
            { infoName: "CardNum", infoValue: "4111111111111111" },
            { infoName: "AuthCode", infoValue: "123456" },
          ],
        },
      }
    );
  } catch (error) {
    console.error("Error in bill fetch:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { billerInfo, billFetch, billPayment };