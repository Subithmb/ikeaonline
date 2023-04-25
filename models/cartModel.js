const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
       
    },
   
   
   products: [
       {
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'product'
        },
       quantity: {
           type: Number,
           
            },
            Tprice: {
                type: Number,
                default:0
           }
}]
       
},
{timestamps:true});


module.exports=mongoose.model("Cart", cartSchema);

