const PayIn = require("../models/payInModel");
const PayOut= require("../models/payOutModel");
const User =require("../models/userModel");

const userWallet = async (userId) => {
    try {
        console.log("User ID:", userId);

        // Ensure userId is in ObjectId format
        const mongoose = require('mongoose');
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Step 1: Aggregate total pay-in amount for the specific user (Only Approved Transactions)
        const payInData = await PayIn.aggregate([
            { $match: { status: "Approved", userId: userObjectId } },
            { 
                $group: {
                    _id: "$userId",
                    totalPayIn: { $sum: "$amount" }
                } 
            }
        ]);

        console.log("PayIn Data:", payInData);

        // Step 2: Aggregate total pay-out amount for the specific user (Only Approved Transactions)
        const payOutData = await PayOut.aggregate([
            { $match: { status: "Approved", userId: userObjectId } },
            { 
                $group: {
                    _id: "$userId",
                    totalPayOut: { $sum: "$amount" }
                } 
            }
        ]);

        console.log("PayOut Data:", payOutData);

        // Step 3: Convert aggregation results into maps for quick lookup
        const payInMap = {};
        payInData.forEach(item => {
            payInMap[item._id.toString()] = item.totalPayIn;
        });

        const payOutMap = {};
        payOutData.forEach(item => {
            payOutMap[item._id.toString()] = item.totalPayOut;
        });

        // Step 4: Fetch the user based on userId
        const user = await User.findById(userObjectId);
        console.log("User:", user);

        if (!user) {
            throw new Error("User not found.");
        }

        // Step 5: Calculate total pay-in, total pay-out, and available balance for the specific user
        const totalPayIn = payInMap[user._id.toString()] || 0;
        const totalPayOut = payOutMap[user._id.toString()] || 0;
        const availableBalance = totalPayIn - totalPayOut;

        // Step 6: Prepare the data
        const data = {
            _id: user._id,
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
            role: user.role,
            totalPayIn,
            totalPayOut,
            availableBalance
        };

        console.log("User Wallet Data:", data);

        return data;

    } catch (error) {
        console.error("Error in user wallet report:", error);
        throw error;
    }
};



const allUserWallet = async() => {
 try {
      // Step 1: Aggregate total pay-in amount per user (Only Approved Transactions)
      const payInData = await PayIn.aggregate([
          { $match: { status: "Approved" } },
          { 
              $group: {
                  _id: "$userId",
                  totalPayIn: { $sum: "$amount" }
              } 
          }
      ]);

      // Step 2: Aggregate total pay-out amount per user (Only Approved Transactions)
      const payOutData = await PayOut.aggregate([
          { $match: { status: "Approved" } },
          { 
              $group: {
                  _id: "$userId",
                  totalPayOut: { $sum: "$amount" }
              } 
          }
      ]);

      // Step 3: Convert aggregation results into maps for quick lookup
      const payInMap = {};
      payInData.forEach(item => {
          payInMap[item._id.toString()] = item.totalPayIn;
      });

      const payOutMap = {};
      payOutData.forEach(item => {
          payOutMap[item._id.toString()] = item.totalPayOut;
      });

      // Step 4: Fetch all users
      const users = await User.find({}, "name email mobileNumber role");
    //   const users = await User.findOne({email});
      // Step 5: Attach total pay-in, total pay-out, and available balance
      const finalData = users.map(user => {
          const totalPayIn = payInMap[user._id.toString()] || 0;
          const totalPayOut = payOutMap[user._id.toString()] || 0;
          const availableBalance = totalPayIn - totalPayOut;

          return {
              _id: user._id,
              name: user.name,
              email: user.email,
              mobileNumber: user.mobileNumber,
              role: user.role,
              totalPayIn,
              totalPayOut,
              availableBalance
          };
      });

      return finalData;

  } catch (error) {
      console.error("Error in payingwalletreport API:", error);
      return error.message;
  }
}

module.exports = {userWallet, allUserWallet}