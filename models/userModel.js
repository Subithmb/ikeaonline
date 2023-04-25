const mongoose=require("mongoose"); 

// user sign-up schema

const userSchema = new mongoose.Schema({
    name: {
      type: "String",
      required: true
    },
    lastname: {
      type: "String",
      required: true
    },
     email: {
      type: "String",
      required: true
    },
    Mobile: {
      type: "number",
      required: true
    },
    password: {
      type: "String",
      required: true
    },
    is_admin: {
      type: "String",
      required: true
    },
    is_varified: {
      type: "String",
      default:0
    },
    is_Blocked: {
      type: "String",
      default:false
    },
    status: {
      type: "boolean",
      default:false
    },
    wallet: {
      type:Number,
      default:0
    }
  });


 module.exports = mongoose.model("User",userSchema);
  