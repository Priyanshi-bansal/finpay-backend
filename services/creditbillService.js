const axios = require("axios");
const secretKey = "abcd@123";
const crypto = require("crypto");
const { encryptCreditCard } = require("../utils/encryptrsa");
const { json } = require("body-parser");

const rechargeValidation = async ({ uid, password, amt, cir, cn, op }) => {
  const url = "https://alpha3.mobikwik.com/recharge/v1/retailerValidation";

  const encryptedCn = encryptCreditCard(cn);
  console.log("encrypted cn", encryptedCn);

  const plainText = `{"uid":"${uid}","password":"${password}","amt":"${amt}","cir":"${cir}","cn":"${encryptedCn}","op":"${op}","adParams":{}}`;
  console.log("dfghj", plainText);

  function generateChecksum(plainText) {
    const hmac = crypto.createHmac("sha256", "abcd@123");
    hmac.update(plainText);
    return hmac.digest("base64");
  }
  const checksum = generateChecksum(plainText);
  console.log("checksum", checksum);

  const headers = {
    "X-MClient": "14",
    "Content-Type": "application/json",
    checkSum: checksum,
  };

  try {
    const response = await axios.post(url, plainText, { headers });

    console.log("status: ", response.status, " data:", response.data);
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("Error while calling recharge API:", error);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: "API request failed" },
    };
  }
};


const rechargeviewbill = async ({ uid, password, mobile, last4, encrypted_card }) => {
  const url = "https://alpha3.mobikwik.com/retailer/v2/retailerCCBill";

  const encryptedCn = encryptCreditCard(encrypted_card);
  console.log("encrypted cn", encryptedCn);
 const body = JSON.stringify({
    uid,
    password,
    last4,
    mobile,
    encryptedCn
 });

 console.log("sfdgfhjh", body);
//   const plainText = `{"uid":"${uid}","password":"${password}","mobile":${mobile},"last4":"${last4}","encrypted_card":"${encryptedCn}",}`;
//   console.log("dfghj", plainText);
  const headers = {
    "X-MClient": "14",
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log("dfgjuhkl", response);
    console.log("status: ", response.status, " data:", response.data);
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("Error while calling recharge API:", error);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: "API request failed" },
    };
  }
};

module.exports = { rechargeValidation, rechargeviewbill };
