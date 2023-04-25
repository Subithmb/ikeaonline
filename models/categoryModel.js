const mongoose=require("mongoose"); 

// user sign-up schema

const categorySchema = new mongoose.Schema({
   categoryName: {
      type: "String",
      required: true
    },
    is_category: {
      type: "String",
      default:0
    },
    is_status: {
      type: "boolean",
      default:false
    }
  });


 module.exports = mongoose.model("category",categorySchema);
  