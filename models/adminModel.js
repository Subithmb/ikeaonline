const mongoose=require("mongoose"); 

// admin schema


  const adminSchema = new mongoose.Schema({
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "String",
      required: true,
    },
    password: {
      type: "String",
      required: true,
    },
  });

 module.exports = mongoose.model("admin",adminSchema);

  