const { default: axios } = require("axios");
const User = require("../models/userModel");
const AdminUser = require("../models/mainwallet");

const PayOut = require("../models/payOutModel");

const mongoose = require("mongoose");

// const payOut = async (req, res) => {
//   const {
//     userId,
//     amount,
//     reference,
//     trans_mode,
//     account,
//     ifsc,
//     name,
//     mobile,
//     email,
//     address,
//   } = req.body;

//   if (!amount || !reference || !name || !mobile || !email || !trans_mode) {
//     return res.send("All fields are required");
//   }

//   const payOutData = await axios.post(
//     "https://api.worldpayme.com/api/v1.1/payoutTransaction",
//     {
//       amount,
//       reference,
//       trans_mode,
//       account,
//       ifsc,
//       name,
//       email,
//       mobile,
//       address,
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI4IiwianRpIjoiOTcwY2YwZTE1NjcxMGIwZDQ3ZWZlOWY0ZWNjYmJkZDMxNjhmNWMxODc3MzE4ZTgwNzdmNmVmNTczOTZlZDIyNjkwNTZiOWNiZTFmNTBlMjEiLCJpYXQiOjE3NDA5NzgxMzkuOTk5MjM0LCJuYmYiOjE3NDA5NzgxMzkuOTk5MjM1LCJleHAiOjE3NzI1MTQxMzkuOTk2NjgxLCJzdWIiOiIyMzciLCJzY29wZXMiOltdfQ.lakPf6sw_uhlkeLzX0iWt3YAkeC4lJd-lici6uc_of4EIEJjMakV9xr77rv35jpNbw2QYDWpVbtNYMZeAWIaX5T9TnbPtI0_J0yyUr6WoKmNtV6xjCU5rJz-QGuLgvg-uurNxsWXW2mo3j3t202fvZPsCdY0PzLlWzDiLQJ8DjKIK10oLagBR7WANafjNujtX84A9wy9xYX1LDNwQtI6d6EjMg4TKwt3MazawXh57TjFC7X4bYMlSNshvCXICMSEQ8z_20GZqBAXtjguPjAmzpgVMD7hcMn4iGLP4Oqfo0hD36xvcszWk62IxsBlNHzwf9SJ6tEqWjJKZ7m36uOT79UEXJXQiPkguqbKZ2G3nQu8HN4rm0ccOFqnqKloNaDQJtbVn9N0PPN_ho_RqrNhA02Ut-BdTWbH8-y2DCQNHJeuf8Iee0f934dlnZPaNC76RHhgyKmsc2eaSmpEr9SGe6P-4BJ-pIJkkyl7xHCT4pu2t9Elt7lpjQW_BwztEZ8SJQNQVkv5hvXrtC-KAdnJ7ZAzMPxmCjSaFRgMGLnHr_iQiS8rTgfQFGBXSK4NXXVClaf0-EFoYIVIWUkhgoDMDJKmcjCDLPxOyjOfGy8Ha3oHvMzalEcLGX13f8a4EzzGPcZ3ZSfo3iqbBTNeFkgMr-39I5d9L5iAGYNz4wFiKA8`,
//       },
//     }
//   );
//   console.log(payOutData.data);
//   if (payOutData.data) {
//     const newPayOut = new PayOut({
//       userId: new mongoose.Types.ObjectId(userId), // Ensuring the userID is a valid ObjectId
//       amount,
//       reference,
//       trans_mode,
//       account,
//       ifsc,
//       name,
//       mobile,
//       email,
//       address,
//     });

//     // Save the record to MongoDB
//     await newPayOut.save();
//     return res.status(200).send({
//       data: payOutData.data,
//       status: payOutData.data.status,
//       message: "Payment data saved successfully in the database.",
//     });
//   } else {
//     return res.status(400).send("bad request");
//   }
// };
// const adminAction = async (req, res) => {
//   const { action, utr } = req.body;
//   const payout = await PayOut.findOne({ utr });
//   if (!payout) {
//     return res.status(404).send("No payout transaction found");
//   }
//   if (action == "APPROVE") {
//     payout.adminAction = "Approved";
//     await payout.save();
//     return res.status(200).send("Payout Request approved  by admin");
//   } else {
//     payout.adminAction = "Reject";
//     await payout.save();
//     return res.status(400).send("Payout Request rejected by admin");
//   }
// };

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
  });

  // Save the payout request to MongoDB
  await newPayOut.save();

  return res.status(200).send({
    message: "Payment data saved successfully in the database.",
  });
};

const adminAction = async (req, res) => {
  const { action, reference } = req.body; // UTR is a unique reference identifier
  const payout = await PayOut.findOne({ reference });
  console.log("szdxfcgv", payout);
  if (!payout) {
    return res.status(404).send("No payout transaction found");
  }

  if (action === "APPROVE") {
    payout.adminAction = "Approved";
    await payout.save();
    const {amount , reference, trans_mode, account, ifsc, name, email, mobile, address} = payout;

    console.log("dfcgvhbhnjmkcv", amount, reference, trans_mode, account, ifsc, name, email, mobile, address);
    // After approval, call the external payout service
    try {
      const payOutData = await axios.post(
        "https://api.worldpayme.com/api/v1.1/payoutTransaction",
        {
          amount , reference, trans_mode, account, ifsc, name, email, mobile, address
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI4IiwianRpIjoiOTcwY2YwZTE1NjcxMGIwZDQ3ZWZlOWY0ZWNjYmJkZDMxNjhmNWMxODc3MzE4ZTgwNzdmNmVmNTczOTZlZDIyNjkwNTZiOWNiZTFmNTBlMjEiLCJpYXQiOjE3NDA5NzgxMzkuOTk5MjM0LCJuYmYiOjE3NDA5NzgxMzkuOTk5MjM1LCJleHAiOjE3NzI1MTQxMzkuOTk2NjgxLCJzdWIiOiIyMzciLCJzY29wZXMiOltdfQ.lakPf6sw_uhlkeLzX0iWt3YAkeC4lJd-lici6uc_of4EIEJjMakV9xr77rv35jpNbw2QYDWpVbtNYMZeAWIaX5T9TnbPtI0_J0yyUr6WoKmNtV6xjCU5rJz-QGuLgvg-uurNxsWXW2mo3j3t202fvZPsCdY0PzLlWzDiLQJ8DjKIK10oLagBR7WANafjNujtX84A9wy9xYX1LDNwQtI6d6EjMg4TKwt3MazawXh57TjFC7X4bYMlSNshvCXICMSEQ8z_20GZqBAXtjguPjAmzpgVMD7hcMn4iGLP4Oqfo0hD36xvcszWk62IxsBlNHzwf9SJ6tEqWjJKZ7m36uOT79UEXJXQiPkguqbKZ2G3nQu8HN4rm0ccOFqnqKloNaDQJtbVn9N0PPN_ho_RqrNhA02Ut-BdTWbH8-y2DCQNHJeuf8Iee0f934dlnZPaNC76RHhgyKmsc2eaSmpEr9SGe6P-4BJ-pIJkkyl7xHCT4pu2t9Elt7lpjQW_BwztEZ8SJQNQVkv5hvXrtC-KAdnJ7ZAzMPxmCjSaFRgMGLnHr_iQiS8rTgfQFGBXSK4NXXVClaf0-EFoYIVIWUkhgoDMDJKmcjCDLPxOyjOfGy8Ha3oHvMzalEcLGX13f8a4EzzGPcZ3ZSfo3iqbBTNeFkgMr-39I5d9L5iAGYNz4wFiKA8`,
          },
        }
      );
      console.log("wertyui", payOutData.data);
      return res.status(200).send({
        data: payOutData.data,
        message: "Payment data saved successfully in the database.",
      });
    } catch (error) {
      console.error("Error calling external payout service:", error);
      return res
        .status(500)
        .send("Internal server error while calling external payout service");
    }
  } else {
    payout.adminAction = "Rejected";
    payout.status = "Failed"; // Mark as failed if rejected
    await payout.save();
    return res.status(400).send("Payout Request rejected by admin");
  }
};

const callbackPayout = async (req, res) => {
  try {
  console.log("callback reqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",req)
    const data = req.body;
    console.log("sdfghj",data)
    const payout = await PayOut.findOne({ reference: data.reference });

    if (!payout) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (data.status === "Success") {
      payout.status = "Approved";
      payout.txn_id = data.txn_id;
      await payout.save();
      console.log("payout callback", payout);
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
};

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
        $lte: new Date(endDate),
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

module.exports = { payOut, adminAction, callbackPayout, payOutReportAllUsers };
