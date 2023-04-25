const express=require("express");
const user_route=express();
const bodyparser=require("body-parser");
const session =require("express-session")


// user folder setting
user_route.set("views",'./views/users')

user_route.use(bodyparser.json())
user_route.use(bodyparser.urlencoded({extended:true}))
user_route.use(session({secret:"key",resave:true,saveUninitialized:true}))
const auth =require('../middleWare/auth')
const userBlocking =require('../middleWare/userBlocking')
const userController=require("../controllers/userController")
  const wishlistController=require("../controllers/wishlistController")
 const carttController= require('../controllers/cartController')
const adminController= require('../controllers/adminController')
const profileController= require('../controllers/profileController')
const orderController= require('../controllers/orderController')
const couponController= require('../controllers/couponontroller')
const FpController= require('../controllers/forgotPasswordController')

// <<<<<<<<<<<<<<<<<<USER SIGN UP  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

user_route.get("/register",userController.loadRegister);

//<<<<<<<<<<<<<<<<<< USER SIGUNUP POST >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

 user_route.post("/usersignUpSubmit",userController.insertUser);

// <<<<<<<<<<<<<<<<<<<<<<<<<<otp submit>>>>>>>>>>>>>>>>>>>>>>>>>>

 user_route.post("/otpSubmit",userController.otpSubmit);
//  <<<<<<<<<<<<<<<<<<<<<<<<< otp page getting  >>>>>>>>>>>>>>>>>>>>>>>>

 user_route.get("/otpPage",userController.otpPage);
//  <<<<<<<<<<<<<<<<<<<<<<<otp resend  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

 user_route.get("/resendOtp",userController.resendOtp);
// user_route.post("/usersignUpSubmit",userController.insertUser);

// user login
user_route.get("/varify",auth.isLogout,userController.VarifyMail);

// <<<<<<<<<<<<<<<<<<<<<<user home >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

user_route.get("/",userController.loadHomeGuest);

// <<<<<<<<<<<<<<<<<<<<<user login page getting>>>>>>>>>>>>>>>>>>>>>>>>>

user_route.get("/login",auth.isLogout,userController.loginLoad);

//<<<<<<<<<<<<<<<<<<<<< user login submit>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

user_route.post("/login",userBlocking.blockUser,userController.verifyLogin);

//<<<<<<<<<<<<<<<<<<<<<<< user homepage>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

user_route.get("/userhome",auth.isLogin,userController.loadHome);

//<<<<<<<<<<<<<<<<<<<<<<< user shop >>>>>>>>>>>>>>>>>>>>>>>>>>>>

user_route.get("/userShop",auth.isLogin,userController.userShop);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<single product>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


user_route.get("/productDetails",auth.isLogin,userController.productDetails);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<category wise filter>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  

user_route.get("/categoryFilter",auth.isLogin,userController.categoryFilter);

//<<<<<<<<<<<<<<<<<<<<<<<<< wish list>>>>>>>>>>>>>>>>>>>>>>

user_route.get("/WishList",auth.isLogin,wishlistController.wishList);

// <<<<<<<<<<<<<<<<<<<add to wish list>>>>>>>>>>>>>>>>>>>>>>>>>

user_route.post("/wishlistData",auth.isLogin,wishlistController.addToWishlist);

//   <<<<<<<<<<<<<<<<<<<<removing data from wishlist>>>>>>>>>>>>>>>>>>>>

user_route.get("/removeWishlist",auth.isLogin,wishlistController.wishlistRemove)



  // user_route.get("/cartDataAdding",auth.isLogin,carttController.addCart)
user_route.post("/cartDataAdding",auth.isLogin,carttController.addCart)

  
//<<<<<<<<<<<<<<<<<<<<<<< cart page>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

user_route.get("/userCart",auth.isLogin,carttController.cartData);

// <<<<<<<<<<<<<<<<<<<<<<<<cart data removing  >>>>>>>>>>>>>>>>>>>

user_route.get("/cartDataRemove",auth.isLogin,carttController.cartRemove);


// <<<<<<<<<<<<<<<<<<<<<cart item quantity increasing >>>>>>>>>>>>>>>>>>>>>>


user_route.post("/cartItemInc",auth.isLogin,carttController.cartItemInc);

// <<<<<<<<<<<<<<<<<<<<<userprofile  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


user_route.get("/userProfile",auth.isLogin,userController.userProfile);

// <<<<<<<<<<<<<<<<<<<<<<<< cart item increment  >>>>>>>>>>>>>>>>>>>>>>>>>

user_route.patch("/increment",auth.isLogin,carttController.increment);

// <<<<<<<<<<<<<<<<<<<<<<<<< cart item decrement   >>>>>>>>>>>>>>>>>>>>>>

user_route.patch("/decrement",auth.isLogin,carttController.decrement);

// <<<<<<<<<<<<<<<<<<<<<<<<<<  checkout  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


user_route.get("/checkout",auth.isLogin,carttController.userCheckout);

// <<<<<<<<<<<<<<<<<<<<<<add address page getting >>>>>>>>>>>>>>>>>>>>>>>

user_route.get("/addaddress",auth.isLogin,profileController.addaddresspage);

// <<<<<<<<<<<<<<<<<<< add address posting  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


user_route.post("/addressSubmit",auth.isLogin,profileController.addnewaddress);
user_route.get("/selectaddress",auth.isLogin,profileController.selectaddress);
user_route.get("/selectaddressis",auth.isLogin,profileController.selectaddressis);

user_route.post("/placeOrder",auth.isLogin,orderController.placeOrder);
user_route.get("/confirm",auth.isLogin,orderController.confirmOrder);
user_route.get("/orderhistory",auth.isLogin,orderController.orderhistory);
user_route.get("/viewOrders",auth.isLogin,orderController.viewOrders);
user_route.post("/ordercancel",auth.isLogin,orderController.orderCancel);

user_route.post("/initiateRazorpay",auth.isLogin,orderController.initiatePay);
user_route.post("/verifyPayment",auth.isLogin,orderController.verifyPayment);
user_route.post("/verifycoupon",auth.isLogin,couponController.validateCoupon);

user_route.post("/passwordchange",auth.isLogin,FpController.passwordreset);
user_route.post("/profileDataChange",auth.isLogin,FpController.profileDataChange);
user_route.post("/forgotpassEmailsubmit",FpController.emailpost);
user_route.get("/forgotpassEmailsubmit",FpController.emailpostget);
user_route.post("/forgotpassOtpSubmit",FpController.forgotpassOtpSubmit);
user_route.post("/changeforgotpass",FpController.forgotpasssubmit);
user_route.get("/resendOtpforForgotpass",FpController.resendOtpforForgotpass);
//<<<<<<<<<<<<<<<<<<<<<<<< user logout>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

user_route.get("/logout",auth.isLogin,userController.userLogout);



// <<<<<<<<<<<<<<<<<<<<module exporting >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports=user_route
