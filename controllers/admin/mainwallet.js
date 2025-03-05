
const PayIn = require("../../models/payInModel");
const PayOut= require("../../models/payOutModel");
const User =require("../../models/userModel")
exports.payingwalletreport = async (req, res) => {
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

      return res.status(200).json({
          success: true,
          data: finalData
      });

  } catch (error) {
      console.error("Error in payingwalletreport API:", error);
      return res.status(500).json({
          success: false,
          message: "Something went wrong",
          error: error.message
      });
  }
};