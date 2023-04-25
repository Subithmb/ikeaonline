const user= require("../models/userModel");
const bcrypt =require("bcrypt")
var message;
require("dotenv").config()
const product=require('../models/productModel');
const category=require('../models/categoryModel');
const banner=require('../models/bannerModel');
const coupon=require('../models/couponModel');
const session=require("express-session")
const nodemailer = require("nodemailer");
var username;
let userData
const cartmodel=require('../models/cartModel');
const { Admin } = require("mongodb");
const { search } = require("../routes/userRoute");
var cartlimit=0;
// password bcrypt

const securePassword= async(password)=>{ try {
   const passwordHash = await bcrypt.hash(password,10);
   return passwordHash;
} catch (error) {
    console.log(error.message);
    res.render('error500')
    }}


    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< user homepageloading >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const loadHome =async(req,res)=>{
    try {

            const bannerData=await banner.find().limit(4).lean()
            const bannerData1=await banner.find().skip(4).limit(4).lean()
          
        const cartData=await cartmodel.findOne({userId:req.session.user_id}).lean()
        const userData=await user.findOne({_id:req.session.user_id}).lean()
        if(userData){

          req.session.name=userData.name;
          username= req.session.name;
        }
      if(cartData){
        cartlimit =cartData.products.length
      }else{
        cartlimit=0
         
      }

        const categoryData=await category.find({is_status:false}).lean()

        const filterProducts=await product.find({status:false}).populate({
            path:'category',
            match:{is_status:false}
        }).lean().limit(12)

        const productData=filterProducts.filter(product=>product.category !== null)

        res.render('userhome',{user1:true,user:true,productData,categoryData,username,cartlimit,bannerData,bannerData1})
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        }}
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< user homepageloading >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const loadHomeGuest =async(req,res)=>{
    try {

            const bannerData=await banner.find().limit(4).lean()
            const bannerData1=await banner.find().skip(4).limit(4).lean()
          
      
      
        username=null
      

        const categoryData=await category.find({is_status:false}).lean()

        const filterProducts=await product.find({status:false}).populate({
            path:'category',
            match:{is_status:false}
        }).lean().limit(12)

        const productData=filterProducts.filter(product=>product.category !== null)

        res.render('userhome',{user1:true,user:true,productData,categoryData,bannerData,bannerData1})
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        }}

        

// <<<<<<<<<<<<<<<<<<<<<<<<<<<  OTP mail sending  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


var OtpCode;
const otpcheck = async function (req, res, next) {
  console.log(newUser);
  OtpCode = Math.floor(100000 + Math.random() * 988800)
  otp = OtpCode
  
  otpEmail = newUser.email
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:process.env.user,
      pass:process.env.pass
    }
  })

  const docs = {
    from: 'ikeaecom2023@gmail.com',
    to: otpEmail,
    subject: 'Your OTP',
    html: `<p style="font-size:24px;font-weight:bold;">${OtpCode}</p><p>IKEA furniture OTP verification code, Do not share with others</p>`
  };

  mailTransporter.sendMail(docs, (err) => {
    if (err) {
      console.log(err)
      res.render('error500')
}})
}



//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  singnup page rendering   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const loadRegister =async(req,res)=>{
    try {
        res.render("registration",{user1:true})
        } catch (error) {
        console.log(error.message);
        res.render('error500')
        }}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  signup user  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var newUser
const insertUser =async(req,res,next)=>{
   try {
    const spassword=await securePassword(req.body.password);

      newUser=new user({
      name:req.body.firstName,
      lastname:req.body.lastName,
      email:req.body.email,
      Mobile:req.body.mobile,
      password:spassword,
      is_admin:0,
     })

  async function userexist() {
  const useremail=newUser.email
    let usercheck = await user.findOne({ email: newUser.email })
    if (usercheck) {
      message = "Account Already Exist Please login"
      res.redirect('/login')
    } else {
      await otpcheck(newUser);
      res.render('otp',{user1:true,useremail,message})
          
    }
  }
userexist()
}
    catch (error) {
    console.log(error.message);
    res.render('error500')
   }}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<  OTP  mail varification  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const otpSubmit = async function (req, res, next) {
   
    const check = req.body.otp;
    const join = check.join('')
    if (OtpCode == join) {
     userData= await user.insertMany([newUser])
      req.session.user_id=userData._id;
     req.session.name=userData.name;
     username= req.session.name;
     req.session.coupocid=0

      res.redirect('/userhome')
    }
    else {
      message = "Otp failed"
      res.redirect('/otpPage')
  }
  }

// <<<<<<<<<<<<<< varify>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const VarifyMail=async(req,res)=>{
    try {
      const updateInfo =await user.updateOne({_id:req.query.id},{$set:{is_varified:1}});
        
        
        res.render("email-varified")
        res.send("email-varified")

    } catch (error) {
        console.log(error.message);
        res.render('error500')
    }
}

//<<<<<<<<<<<<<<<<<<<<<<<<< login used >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const loginLoad= async(req,res)=>{
    try {
        res.render('login',{user1:true})
    } catch (error) {
        console.log(error.message);
        res.render('error500')
    }
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<< otp page >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const otpPage=function(req,res){
    res.render('otp',{user1:true,message:'otp is not matching'})
   
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<< Resending otp >>>>>>>>>>>>>>>>>>>>>>>
const resendOtp = async function (req, res, next) {
    await otpcheck();
    res.redirect('/otpPage')
  }
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< login varification usind db data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const verifyLogin =async(req,res)=>{
    try {
       const email =req.body.email;
       const password =req.body.password;
      userData = await user.findOne({email:email})

     req.session.name=userData.name;
      username= req.session.name;

     if(userData ){
       const passwordMatch =await bcrypt.compare(password,userData.password)
      if(passwordMatch){
        req.session.user_id=userData._id;
      
            res.redirect('/userhome')
       }else{
        res.render('login',{user1:true,message:"email or password incorrect"})

       }
     } else{
            res.render('login',{user1:true,message:"email or password incorrect"})
     }
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        }}


// <<<<<<<<<<<<<<<<<<<<<<<<< user shopageloading  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const userShop =async(req,res)=>{
    try {
          var search= req.query.search || ''
        
      const categoryData=await category.find({is_status:false}).lean()
     
      const limit = 9;
      const page = parseInt(req.query.page) || 1;
      
      const filterProducts=await product.find({status:false,productName:{ $regex: '.*' + search + '.*', $options: 'i' }}).populate({
        path:'category',
        match:{is_status:false}
      }).lean().skip((page-1)*limit).limit(limit)              
      const countproduct=await product.find({status:false }).populate({
        path:'category',
        match:{is_status:false}
      }).lean().countDocuments()           
     
      const productData=filterProducts.filter(product=>product.category !== null)
      
         const pros=await product.find({status:false}).populate({
           path:'category',
           match:{is_status:false}
          }).lean()               
          .skip((page-1)*limit).limit(limit)
          
          totalPages= Math.ceil(countproduct/ limit),
                  currentPage= page
      

            res.render('shop',{user1:true,user:true,filterProducts,productData,categoryData,username,cartlimit,pros,totalPages,currentPage})

    } catch (error) {
        console.log(error.message);
        res.render('error500')
        }}


        //<<<<<<<<<<<<<<<<<<<< productDetails  >>>>>>>>>>>>>>>>>>>>>>>>>

const productDetails =async(req,res)=>{
    try {
         const userProducts=await product.findOne({_id:req.query.id}).lean()
       
        const{_id,productName,price,category,quantity,image,status}=userProducts

        res.render('productsingle',{user:true,user1:true,username,productName,price,category,quantity,image,cartlimit,_id})
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        }}
// <<<<<<<<<<<<<<<<<<<<<<<<< user profile >>>>>>>>>>>>>>>>>>>>>


const userProfile=async(req,res)=>{
    try {
        userid=req.session.user_id
      
        const userpro=await user.findOne({_id:userid}).lean()
       const coupons= await coupon.find({expiryDate:{$gt:Date.now()}}).limit(1) 
     
        res.render('userProfile',{user:true,user1:true,username,userpro,coupons})
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        
    }
}



// <<<<<<<<<<<<<<<< category filter >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


        const categoryFilter=async (req,res)=>{
            try {
                const categoryData=await category.find({is_status:false}).lean()
                const productData=await product.find({category:req.query.id,status:false}).lean()
              
                if(productData){
                    res.render('shop',{user1:true,user:true,productData,categoryData,username})
                }
            } catch (error) {
                console.log(error.message);
                res.render('error500')
                
            }
        }


  
  //<<<<<<<<<<<<<<<<<<<<< user logout  >>>>>>>>>>>>>>>>>>>>>>>>>>
  
  const userLogout =async(req,res)=>{
      try {
           req.session.destroy();
           username=null;
        
          res.redirect('/login')
      } catch (error) {
          console.log(error.message);
          res.render('error500')
          }}


module.exports={
    loadRegister,
    insertUser,
    VarifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userShop,
    userLogout,
    otpcheck,
    productDetails,
    categoryFilter,
    userProfile,
    otpSubmit,
    otpPage,
    resendOtp,
    loadHomeGuest
   
   
    // wishList
}
