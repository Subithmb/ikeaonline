const mongoose=require("mongoose"); 



const bannerSchema = new mongoose.Schema({
   bannerName: {
      type: "String",
      required: true
    },
    discription: {
      type: "String",
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


 module.exports = mongoose.model("banner",bannerSchema);
  