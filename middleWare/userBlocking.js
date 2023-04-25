const user=require("../models/userModel")


const blockUser=async(req,res,next)=>{
    try {
        
      const userData= await user.findOne({email:req.body.email})
     
      if(userData.status==false){ }
      else{
        // return res.json({message:'you are blocked '}) 
        res.render('login',{user1:true,message:"you are blocked"})
      }
      next();
    } catch (error) {
        console.log(error.message);
        
    }}
    
//     function addToCartlist(proId) {
     
//      event.preventDefault()
//      $.ajax({
//          url: '/cartDataAdding',
//          data: {
//         product: proId,},
//         method: 'post',
//        success: (response) => {   
//       if (response) {

//       swal("Product added to Cart !", "Product added to Cart !", "success");}
// },
// error: (error) => {
// alert(error)
//          } },)
// }

    

    module.exports={blockUser}