const razorpay=require('razorpay')
const crypto = require('crypto');
require("dotenv").config()


var instance = new razorpay({ key_id:process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

module.exports={
 initiateRazorpay:async(orderId,amount)=>{

     const value= await instance.orders.create({
       amount: amount*100,
       currency: "INR",
       receipt: "receipt#1",
       notes: {
         key1: "value3",
         key2: "value2"
       }
     })
     return value;
 },

 validate: async (razorData) => {

    let hmac = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET);
   await  hmac.update(razorData.razorResponse.razorpay_order_id + '|' + razorData.razorResponse.razorpay_payment_id);
    hmac =await hmac.digest('hex');
    if (hmac == razorData.razorResponse.razorpay_signature)
      return orderConfirmed = true;
   
    return orderConfirmed = false;
  }
}