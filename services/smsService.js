const axios = require("axios");

const sendOtp = async (mobileNumber, otp) => {
  try {
    const apiKey = process.env.FLASH2SMS_API_KEY;
    const senderId = process.env.FLASH2SMS_SENDER_ID;
    const message = `Your OTP is ${otp}`;

    if (!apiKey || !senderId) {
      console.error("Missing API Key or Sender ID");
      throw new Error("Fast2SMS API key or Sender ID is missing");
    }

    const params = {
      authorization: apiKey,
      route: "q",  // Change route if needed (e.g., "dlt")
      sender_id: senderId,
      message,
      language: "english",
      numbers: mobileNumber,
    };

    console.log("Fast2SMS Request Params:", params);  // Debugging log

    const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", params);
    console.log("Fast2SMS Response:", response.data);

    return response.data.return
      ? { success: true, message: "OTP sent successfully" }
      : { success: false, message: response.data.message || "Failed to send OTP" };

  } catch (error) {
    console.error("Error in sendOtp:", error.response?.data || error.message);
    return { success: false, message: "Error sending OTP" };
  }
};

module.exports = { sendOtp };
