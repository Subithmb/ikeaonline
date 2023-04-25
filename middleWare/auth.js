const { loginLoad } = require("../controllers/userController")

//  AUTHENTICATION  MIDDLEWARE LOGIN

const isLogin=async(req,res,next)=>{
    try {
        if(req.session.user_id){}
        else{
            res.redirect('/login')
        }
        next();   
    }
     catch (error) {
       console.log(error.message); 
    }}

//  AUTHENTICATION  MIDDLEWARE LOGOUT

const isLogout=async(req,res,next)=>{
    try {
        if(req.session.user_id){
        
            res.redirect('/userhome')
        }next()
    } catch (error) {
       console.log(error.message); 
    }}
module.exports={
    isLogin,
    isLogout
}