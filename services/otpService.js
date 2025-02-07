const generateOtp = async (mobileNumber) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Remove existing OTPs before creating a new one
    await OTP.deleteMany({ mobileNumber });
    await OTP.create({ mobileNumber, otp });
    return otp;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw new Error("Failed to generate OTP");
  }
};