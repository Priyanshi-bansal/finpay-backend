const User = require("../../models/userModel");
const PayIn = require("../../models/payInModel");
const PayOut = require("../../models/payOutModel");

const {userWallet} = require("../../services/mainWalletService");

const addPaymentRequest = async (req, res) =>{
    try {
        const {userId, amount, utr, amountType, transferMode} = req.body;
        console.log(req.body);
        let Admin = await User.findOne({role:"Admin"});
        if(!Admin){
           return res.status(404).send("There is no such Admin User found");
        }
        let user = await User.findById(userId);
        if(!user){
          return  res.status(404).send("No User Found")        
        }

        const adminId = Admin._id;
        const adminWalletdata = await userWallet(adminId);

        if(amount > adminWalletdata.availableBalance){
          return  res.status(400).send("Not enough balance available in your wallet");
        }
        if(amountType == "debit"){
            const newPayIn = new PayIn({
                userId: new mongoose.Types.ObjectId(userId), // Ensuring the userID is a valid ObjectId
                amount,
                name: user.name,
                mobile:user.mobileNumber,
                email:user.email,
                status:"Approved",
                utr,
                transferMode
              });
          
              // Save the record to MongoDB
              await newPayIn.save();

              const adminPayout = new PayOut({
                userId: new mongoose.Types.ObjectId(adminId), // Ensuring the userID is a valid ObjectId
                amount,
                name: Admin.name,
                mobile: Admin.mobileNumber,
                email: Admin.email,
                status: "Approved",
                utr,
                trans_mode: transferMode
              })
              await adminPayout.save();
        }else{
            const newPayOut = new PayOut({
                userId: new mongoose.Types.ObjectId(userId), // Ensuring the userID is a valid ObjectId
                amount,
                name: user.name,
                mobile:user.mobileNumber,
                email:user.email,
                status:"Approved",
                utr,
                trans_mode: transferMode
              });
          
              // Save the record to MongoDB
              await newPayOut.save();

              const adminPayIn = new PayIn({
                userId: new mongoose.Types.ObjectId(adminId), // Ensuring the userID is a valid ObjectId
                amount,
                name: Admin.name,
                mobile: Admin.mobileNumber,
                email: Admin.email,
                status: "Approved",
                utr,
                transferMode
              })
              await adminPayIn.save();
        }
       
        return res.status(200).send("Payment request is successful");

    } catch (error) {
        console.log("Internal server Error", error);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = {addPaymentRequest}