
exports.payingwalletreport = async (req, res) => {
    try {
      //console.log(" API Called: /api/admin-users/alluserwallet");
  
      // Step 1: Aggregate total pay-in amount per user
      //console.log(" Fetching total pay-in data...");
      const payInData = await PayIn.aggregate([
        {
          $match: { status: "Approved" } // Sirf approved transactions count karenge
        },
        {
          $group: {
            _id: "$userId",
            totalPayIn: { $sum: "$amount" } // Total pay-in sum
          }
        }
      ]);
      //console.log("PayIn Aggregation Result:", payInData);
  
      // Step 2: Convert aggregation result to an object for quick lookup
      const payInMap = {};
      payInData.forEach(item => {
        payInMap[item._id.toString()] = item.totalPayIn;
      });
      //console.log("PayIn Map Created:", payInMap);
  
      // Step 3: Fetch all users
      //console.log("Fetching all users...");
      const users = await User.find({}, "name email mobileNumber role payInWallet");
      //console.log("Users Fetched:", users.length, "users found.");
  
      // Step 4: Attach total pay-in amount to users
      //console.log(" Mapping users with total pay-in...");
      const finalData = users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        payInWallet: user.payInWallet,
        totalPayIn: payInMap[user._id.toString()] || 0  // Default 0 if no PayIn found
      }));
  
      //console.log(" Final Data Prepared:", finalData);
  
      return res.status(200).json({
        success: true,
        data: finalData
      });
  
    } catch (error) {
      console.error(" Error in payingwalletreport API:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message
      });
    }
  };