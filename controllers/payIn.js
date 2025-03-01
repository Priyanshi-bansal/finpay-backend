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

const callback = async (req, res) => {
  try {
    const data = req.body;
    const payin = await PayIn.findOne({ reference: data.reference });

    if (!payin) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (data.status === "Success") {
      // Find Retailer & Super Admin
      const retailer = await User.findById(payin.userId); // Assuming payin has userId
      const superAdmin = await AdminUser.findOne({ role: "SuperAdmin" });

      if (!retailer || !superAdmin) {
        return res.status(400).json({ message: "User or Admin not found" });
      }

      // Update PayIn Transaction
      payin.status = "Approved";
      payin.utr = data.utr;
      await payin.save();

      // Update Wallets
      retailer.payInWallet += payin.amount;
      superAdmin.wallet += payin.amount;

      await retailer.save();
      await superAdmin.save();

      // Log Transaction History
      await Transaction.create({
        userId: retailer._id,
        type: "PayIn",
        amount: payin.amount,
        status: "Success",
        reference: data.reference
      });

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

const payOut = async (req, res) => {
  const {
    userId,
    amount,
    reference,
    trans_mode,
    account,
    ifsc,
    name,
    mobile,
    email,
    address,
  } = req.body;

  if (!amount || !reference || !name || !mobile || !email || !trans_mode) {
    return res.send("All fields are required");
  }
  const payOutData = await axios.post(
    "https://api.worldpayme.com/api/v1.1/payoutTransaction",
    {
      amount,
      reference,
      trans_mode,
      account,
      ifsc,
      name,
      email,
      mobile,
      address,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI4IiwianRpIjoiZjgzNmIxMmVmOWExZWJhZmE2MzQ3NzBmMDMwMzhhYTlhZWFlOTRmMzk3Nzg2NTk4MDIxOTNlYTY1OWMxM2FjNWFjYTU4ZjhkMzdlMjJiMGQiLCJpYXQiOjE3MzY0MjMwNjUuNDEyNzAyLCJuYmYiOjE3MzY0MjMwNjUuNDEyNzAzLCJleHAiOjE3Njc5NTkwNjUuNDEwMDQ3LCJzdWIiOiIxNTkiLCJzY29wZXMiOltdfQ.RoH3GH7ljYL1kZGw4h1aiBYSp9WkSsOxhjx3nI7Hq7K68eml7hHFFk2d15pE1KW-8cq_yH70QMlgJ_mcmbq-rtMITPnQbkXsdv4P6F5iT3YBcJ3VjVxCVK8z0C_diq2l-SR5wUX5xtnDTv0l_dgdeq_8nrD_RSS3xC4d-CuoDmtx_QnjqFsiQdE0diPOeI3T_UHo1TB-SvbAofga7cb6IXyuW3nw4rRRsqJmTdH39mv3y10y3Dt8dCM21Oyw7F02W2-_HtTqNe5qhMHfzlISCr7H4rcq3nzxWUWlvFB-xcmnFzVqAHrKA9HZV1h2ovoQPp-QYhfTIzKRtaVx5wKXfitKGtjyIJErdN20GanpF--mzbzAplXeH_bv6-nX16vhFCfINtwSkukysP5irs0QMBb6BAOY0LUB_AIHxXgK93U6mmkv6QvpjPtOwG5OFsLi9QeTIX2wuAGsvvS5zyXLadmOMsE9xffZzQJ2LRBZvQE0UTouvK1KMM3UbPRWpnDbhdNJpWOGdUaq8JXgyx7VFIVcsBVUTQvt3E-0p1eT_A_09rBzI4McvOrQ6KDbS7buRe9BJBredCuU9rJBs4-J2kEAYxCOcMLd86NB1WFEHZT4csl59Xn8JbUopG9HYydT7stpq6bGgW-LFRbNg5jDEmGH2w9jmYydgCkgs7xkrH8`,
      },
    }
  );
  //console.log(payOutData.data);
  if (payOutData.data) {
    const newPayOut = new PayOut({
      userId: new mongoose.Types.ObjectId(userId), // Ensuring the userID is a valid ObjectId
      amount,
      reference,
      trans_mode,
      account,
      ifsc,
      name,
      mobile,
      email,
      address,
      status:payOutData.data.status.status,
      txn_id:payOutData.data.status.data.txn_id

    });

    // Save the record to MongoDB
    await newPayOut.save();
    return res
      .status(200)
      .send({
        data: payOutData.data,
        status: payOutData.data.status,
        message: "Payment data saved successfully in the database.",
      });
  } else {
    return res.status(400).send("bad request");
  }
};

module.exports = { payIn, payOut, callback, getPayInRes };
