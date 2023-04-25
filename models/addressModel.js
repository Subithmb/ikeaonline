const mongoose=require("mongoose"); 

// user sign-up schema

const addressSchema = mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    address:{
      type:Array,
      require:true
    },
//     address:[{
//       name: {
//         type: "String",
        
//       },
//       lastname: {
//         type: "String",
        
//       },
//        email: {
//         type: "String",
       
//       },
//       Mobile: {
//         type: "number",
       
//       },
//       AlternateMobile: {
//         type: "number",
        
//       },
//       pincode: {
//         type: "number",
       
//       },
//       city: {
//           type: "String",
         
//         },
//       state: {
//           type: "String",
         
//         },
//       landmark: {
//           type: "String",
         
//         }

// }],
    
    
    status: {
      type: "boolean",
      default:false
    }
  },
  {timestamps:true});


 module.exports = mongoose.model("address",addressSchema);