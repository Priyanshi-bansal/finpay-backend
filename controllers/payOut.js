const { default: axios } = require("axios");
const User =require("../models/userModel")
const AdminUser =require("../models/mainwallet")

const PayOut = require("../models/payOutModel");

const mongoose = require('mongoose');


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
        address
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
  
  const callbackPayout = async (req, res) =>{
      try {
        const data = req.body;
        const payout = await PayOut.findOne({ reference: data.reference });
    
        if (!payout) {
          return res.status(404).json({ message: "Transaction not found" });
        }
    
        if (data.status === "Success") {
          payout.status = "Approved";
          payout.txn_id = data.txn_id;
          await payout.save();
    
          return res.status(200).json({ message: "PayOut successful", payout });
        }
    
        // Handle Failed Transaction
        payout.status = "Failed";
        await payout.save();
    
        return res.status(400).json({ message: "Payment Failed", payout });
      } catch (error) {
        console.error("Error in callback response", error);
        return res.status(500).json({ message: "Something went wrong" });
      }
    
  }

  const payOutReportAllUsers = async (req, res) => {
    try {
      const { userId, startDate, endDate, status } = req.query; // Query Parameters for Filtering
  
      let filter = {};
  
      if (userId) {
        filter.userId = new mongoose.Types.ObjectId(userId); // Agar kisi ek user ka dekhna ho
      }
      if (status) {
        filter.status = status; // Success, Failed, Pending
      }
      if (startDate && endDate) {
        filter.createdAt = { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        };
      }
  
      // Aggregation Pipeline
      const payouts = await PayOut.aggregate([
        { $match: filter }, // Filters Apply
        {
          $lookup: {
            from: "users", // Join Users Collection
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
            trans_mode: 1,
            account: 1,
            ifsc: 1,
            status: 1,
            txn_id: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } }, // Latest Payout First
      ]);
  
      return res.status(200).json({ success: true, data: payouts });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  module.exports = { payOut, callbackPayout, payOutReportAllUsers };