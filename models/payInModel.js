const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const payInSchema = new mongoose.Schema(
    {
        userId : {
            type:Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        amount :{
            type:Number,
            required:true
        }, 
        reference:{
            type:String,
            required:false
        }, 
        name:{
            type:String,
            required:true
        }, 
        mobile:{
            type:Number,
            required:true
        }, 
        email:{
            type:String,
            required:true
        },
        status:{
            type: String,
            enum: ["Pending", "Approved", "Failed"], 
            default: "Pending",
            required:false
        },
        utr: {
            type: String,
            required: false,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        transferMode: {
            type: String,
            required: false
        }
    }
);

module.exports = mongoose.model("PayIn", payInSchema);