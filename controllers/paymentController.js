const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const { default: axios } = require("axios");
const PayIn = require("../models/payInModel");
const PayOut = require("../models/payOutModel");
const mongoose = require('mongoose');

const payIn = async (req, res) => {
  const { userId, amount, reference, name, mobile, email } = req.body;

  if (!amount || !reference || !name || !mobile || !email) {
    return res.send("All fields are required");
  }
  const payInData = await axios.post(
    "https://api.worldpayme.com/api/v1.1/createUpiIntent",
    {
      amount,
      reference,
      name,
      mobile,
      email,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI4IiwianRpIjoiZjgzNmIxMmVmOWExZWJhZmE2MzQ3NzBmMDMwMzhhYTlhZWFlOTRmMzk3Nzg2NTk4MDIxOTNlYTY1OWMxM2FjNWFjYTU4ZjhkMzdlMjJiMGQiLCJpYXQiOjE3MzY0MjMwNjUuNDEyNzAyLCJuYmYiOjE3MzY0MjMwNjUuNDEyNzAzLCJleHAiOjE3Njc5NTkwNjUuNDEwMDQ3LCJzdWIiOiIxNTkiLCJzY29wZXMiOltdfQ.RoH3GH7ljYL1kZGw4h1aiBYSp9WkSsOxhjx3nI7Hq7K68eml7hHFFk2d15pE1KW-8cq_yH70QMlgJ_mcmbq-rtMITPnQbkXsdv4P6F5iT3YBcJ3VjVxCVK8z0C_diq2l-SR5wUX5xtnDTv0l_dgdeq_8nrD_RSS3xC4d-CuoDmtx_QnjqFsiQdE0diPOeI3T_UHo1TB-SvbAofga7cb6IXyuW3nw4rRRsqJmTdH39mv3y10y3Dt8dCM21Oyw7F02W2-_HtTqNe5qhMHfzlISCr7H4rcq3nzxWUWlvFB-xcmnFzVqAHrKA9HZV1h2ovoQPp-QYhfTIzKRtaVx5wKXfitKGtjyIJErdN20GanpF--mzbzAplXeH_bv6-nX16vhFCfINtwSkukysP5irs0QMBb6BAOY0LUB_AIHxXgK93U6mmkv6QvpjPtOwG5OFsLi9QeTIX2wuAGsvvS5zyXLadmOMsE9xffZzQJ2LRBZvQE0UTouvK1KMM3UbPRWpnDbhdNJpWOGdUaq8JXgyx7VFIVcsBVUTQvt3E-0p1eT_A_09rBzI4McvOrQ6KDbS7buRe9BJBredCuU9rJBs4-J2kEAYxCOcMLd86NB1WFEHZT4csl59Xn8JbUopG9HYydT7stpq6bGgW-LFRbNg5jDEmGH2w9jmYydgCkgs7xkrH8`,
      },
    }
  );
  console.log(payInData.data);
  if (payInData.data) {
    // Create the new PayIn record
    const newPayIn = new PayIn({
      userId: new mongoose.Types.ObjectId(userId), // Ensuring the userID is a valid ObjectId
      amount,
      reference,
      name,
      mobile,
      email,
      status:payInData.data.status
    });

    // Save the record to MongoDB
    await newPayIn.save();
    // Respond with the API response and database entry confirmation
    return res.status(200).send({
      data: payInData.data,
      status: payInData.data.status,
      message: "Payment data saved successfully in the database.",
    });
  } else {
    return res.status(400).send("bad request");
  }
};

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
  console.log(payOutData.data);
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

module.exports = { payIn, payOut };
