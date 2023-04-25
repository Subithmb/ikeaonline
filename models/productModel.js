const mongoose=require("mongoose"); 

// user sign-up schema

const productSchema = new mongoose.Schema({
    productName: {
      type: "String",
      required: true
    },
    price: {
      type: "number",
      required: true
    },
     category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'category'
    },
    quantity: {
      type: "number",
      required: true
    },
      image: {
      type: "Array",
      required: true
    },
      status: {
      type: "boolean",
      default:false
    }
  });


 module.exports = mongoose.model("product",productSchema);
  