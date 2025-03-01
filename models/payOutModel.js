const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payOutSchema = new mongoose.Schema(
    {
        userId : {
            type:Schema.Types.ObjectId,
            ref:"Users",
            required: true,
        },
        amount :{
            type:Number,
            required:true
        }, 
        reference:{
            type:String,
            required:true
        }, 
        trans_mode :{
            type : String,
            required:true,
        },
        account:{
            type:Number,
            required:true
        },
        ifsc :{
            type:String,
            required:true
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
        address:{
            type:String,
            required:false
        },
        status:{
            type: String,
            enum: ["Pending", "Approved", "Failed"], 
            default: "Pending",
            required:false
        },
        txn_id:{
            type:String,
            required:true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    }
);

module.exports = mongoose.model("PayOut", payOutSchema);