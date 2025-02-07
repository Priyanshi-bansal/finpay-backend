const axios = require("axios");

const sendOtp = async (mobileNumber, otp) => {
  try {
    const apiKey = process.env.FLASH2SMS_API_KEY; // Ensure this is set in your environment variables
    const senderId = process.env.FLASH2SMS_SENDER_ID; // Ensure this is set too
    const message = 178947; // The template ID from Fast2SMS
    const variablesValues = `${otp}|`; // OTP value inserted into the template
    const flash = "0"; // Optional, you can change to "1" for flash messages if needed

    if (!apiKey || !senderId) {
      console.error("Missing API Key or Sender ID");
      throw new Error("Fast2SMS API key or Sender ID is missing");
    }

    // Construct the Fast2SMS URL with query parameters
    const url = "https://www.fast2sms.com/dev/bulkV2";
    const params = {
      authorization: apiKey,
      route: "dlt",
      sender_id: senderId,
      message: message,
      variables_values: variablesValues,
      flash: flash,
      numbers: mobileNumber,
    };

    // Send the GET request to Fast2SMS API
    const response = await axios.get(url, { params });

    console.log("Fast2SMS Response:", response.data);

    if (response.data.return) {
      return { success: true, message: "OTP sent successfully" };
    } else {
      return { success: false, message: response.data.message || "Failed to send OTP" };
    }
  } catch (error) {
    console.error("Error in sendOtp:", error.message);
    return { success: false, message: "Error sending OTP" };
  }
};

module.exports = { sendOtp };
