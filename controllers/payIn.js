const { default: axios } = require("axios");
const PayIn = require("../models/payInModel");
const User =require("../models/userModel")
const AdminUser =require("../models/mainwallet")

const PayOut = require("../models/payOutModel");

const mongoose = require('mongoose');


const payIn = async (req, res) => {
 
  const {amount, reference, name, mobile, email, userId} = req.body;
 
  if (!amount || !reference || !name || !mobile || !email || !userId) {
    return res.send("All fields are required");
  }
 
  const payInData = await axios.post(
    "https://api.worldpayme.com/api/v1.1/createUpiIntent",
    {
      amount,
      reference,
      name,
      email,
      mobile
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI4IiwianRpIjoiYTNiNzZlMDIwNzViMDJkOTZiNzZiNjllNjQ1YjA5NmY3M2YxMzkyMmM2ZjljNGRmNzg1N2VhZmQ1MGVjN2IwNWI2YzRjYTM1Mjg2OWEyY2IiLCJpYXQiOjE3NDAxMTUyMjIuMjAzODYzLCJuYmYiOjE3NDAxMTUyMjIuMjAzODY1LCJleHAiOjE3NzE2NTEyMjIuMjAxNjE1LCJzdWIiOiIxNTkiLCJzY29wZXMiOltdfQ.m7MXxF7LQu2P-16I0-7sYex-BueKq6K-KrbJdaqRbSsbsAXc1T9dQyqWYDXVzAlezEqbsjZqiyjXqZwUyuu1whlHdghMBxHqnwwhyip6am1JYiZ6uz97a7dLzuPLFolUZmQ8kcWzsCwBbUPdcR5wbPZ_kpgjbvJsb7ffZwj6Fgp1f4OAUnDSHzIkFqPscggJSNT-gHH_ph5v2zWXYw9RG-BXg_w_7Ici0JAQ7dE4eQ5Wzq66LO3aQKWF1GwGwjvdIy5kSLcf07TrwDXQyfQIWUQFQByAlzXqWycHwTs0l9jVyyUliEFI3zzC0TQEL2-ol3VFC3w8ff0rE-9Z78s0DlV7jlItFlYHWrst0df4mNmKyS4VSOuntXrm7zw9SHmDs-SjfHTowGfyB4_7nOIWtVR-XfC7KnoDEUuE77BZVVggoW569D6toiqljneqkL-bo8GZDoWYCrBcY_hd7feYP0F-ewRNm7c5djssrDeKggVFQS_x5fl9FATlRbijqq_1bFRcaF1ea-GzLzutorNYg63nx8jV-tUnl-hLJQpI9XqbQE-N29_Aj7D5jkpVZIhM8zVznSKcPi3ClZEhJQ2d3JOLffGAmxtKez4eUfK0uW2d13UnczuwJJQvMejy0b0eqGr8SkUW0DZzh2IZ_IH7G_uhQub5qlJPLBElmXTvL2g`,
      },
    }
  );
  //console.log(payInData.data);
  if (payInData.data) {
    const newPayIn = new PayIn({
      userId: new mongoose.Types.ObjectId(userId), // Ensuring the userID is a valid ObjectId
      amount,
      reference,
      name,
      mobile,
      email
    });

    // Save the record to MongoDB
    await newPayIn.save();
    return res
      .status(200)
      .send({
        data: payInData.data,
        status: payInData.data.status,
        message: "Payment data saved successfully in the database.",
      });
  } else {
    return res.status(400).send("bad request");
  }
};

const callbackPayIn = async (req, res) => {
  try {
    const data = req.body;
    const payin = await PayIn.findOne({ reference: data.reference });

    if (!payin) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (data.status === "Success") {
     
      // Update PayIn Transaction
      payin.status = "Approved";
      payin.utr = data.utr;
      await payin.save();

      // // Log Transaction History
      // await Transaction.create({
      //   userId: retailer._id,
      //   type: "PayIn",
      //   amount: payin.amount,
      //   status: "Success",
      //   reference: data.reference
      // });

      return res.status(200).json({ message: "PayIn successful", payin });
    }

    // Handle Failed Transaction
    payin.status = "Failed";
    await payin.save();

    return res.status(400).json({ message: "Payment Failed", payin });
  } catch (error) {
    console.error("Error in callback response", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getPayInRes = async (req, res) =>{
  const {reference} = req.query;
  const payin = await PayIn.findOne({reference});
  if(!payin){
    return res.status(404).send("No data found");
  }
  return res.status(200).send(payin);
}

const payInReportAllUsers = async (req, res) => {
  try {
    const { userId, startDate, endDate, status, paymentGateway } = req.query; // Query Parameters

    let filter = {};

    if (userId) {
      filter.userId = new mongoose.Types.ObjectId(userId);
    }
    if (status) {
      filter.status = status; // Pending, Approved, Failed
    }
    if (paymentGateway) {
      filter.paymentGateway = paymentGateway; // Razorpay, Paytm, etc.
    }
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Aggregation Pipeline
    const payIns = await PayIn.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
          amount: 1,
          reference: 1,
          paymentGateway: 1,
          paymentMode: 1,
          status: 1,
          utr: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } }, // Sorting by latest transactions
    ]);

    return res.status(200).json({ success: true, data: payIns });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { payIn, callbackPayIn, getPayInRes, payInReportAllUsers};
