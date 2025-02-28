const axios = require("axios");
const { encryptData, decryptData } = require("../../utils/encryption");

const BBPS_API_URL = process.env.BBPS_API_URL;

// Biller Info Fetch API
const billerInfo = async (req, res) => {
  console.log("Received Request Body:", req.body);
  const {requestId} = req.query;
  const { billerId } = req.body;
  const billerIdData = billerId[0];
  console.log("biller id is", billerIdData);

  console.log("Validated Request Data:", { billerIdData });

  // Encrypt data
  const encryptedData = encryptData(
    billerIdData ,
    process.env.ENCRYPTION_KEY
  );
  console.log("Encrypted Data:", encryptedData);

  try {
    // Send request to BBPS API
    const response = await axios.post(
      `${BBPS_API_URL}/extMdmCntrl/mdmRequestNew/json?accessCode=${process.env.ACCESS_CODE}&requestId=${requestId}&ver=${process.env.VERSION}&instituteId=${process.env.AGENT_ID}`,
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

    // Check if the response contains the expected encrypted response
    if (response.data && response.data.enc_response) {
      // Decrypt response
      const decryptedResponse = decryptData(
        response.data.enc_response,
        process.env.ENCRYPTION_KEY
      );
      console.log("Decrypted Response:", decryptedResponse);
      res.json(JSON.parse(decryptedResponse));
    } else {
      console.error("No encrypted response found in API response.");
      res.status(400).json({ error: "Invalid response from BBPS API" });
    }
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
