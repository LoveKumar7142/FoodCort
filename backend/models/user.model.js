import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required : true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        // yaha pr hum required true nii krange kuki hum google se bhe to signup ya login kr sakte h so eseliye yaha nii krange eski jagha hum frontend me kr denge true ook jaha form create kr denge
    },
    mobile:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","owner","deliveryBoy"],
        required:true
    },
    resetOtp:{
        type:String,

    },
    isOtpVerified:{
        type:Boolean,
        default:false
    },
    otpExpires:{
        type:Date,
        
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User