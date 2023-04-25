const { loginLoad } = require("../controllers/userController")

//  AUTHENTICATION  MIDDLEWARE LOGIN

const isadmin=async(req,res,next)=>{
    try {
        if( req.session.admin){ next();}
            
        else{
            res.redirect('/admin')
        }
         
    }
     catch (error) {
       console.log(error.message); 
    }}





// //  AUTHENTICATION  MIDDLEWARE LOGOUT

// // const isadminout=async(req,res,next)=>{
// //     try {
// //         if(req.session.user_id){
        
// //             res.redirect('/admin')
// //         }next()
// //     } catch (error) {
// //        console.log(error.message); 
// //     }}
 module.exports={
    isadmin,
//     // isadminout
 }