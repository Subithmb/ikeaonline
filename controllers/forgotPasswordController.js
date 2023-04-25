const user= require("../models/userModel");
const bcrypt =require("bcrypt")
var message;
const session =require("express-session")
const nodemailer = require("nodemailer");
const coupon=require('../models/couponModel');
// password bcrypt

const securePasswords= async(password)=>{ try {
   const passwordHash = await bcrypt.hash(password,10);
   return passwordHash;
} catch (error) {
    console.log(error.message);
    res.render('error500')
    }}
   
// <<<<<<<<<<<<<<<<<<<<<<<<<<<  OTP mail sending  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


var OtpCode;
var newUser;
const otpcheck = async function (req, res, next) {
  console.log(newUser);
  OtpCode = Math.floor(100000 + Math.random() * 988800)
  otp = OtpCode
  
  otpEmail = newUser.email
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:'ikeaecom2023@gmail.com',
      pass:'epofkzslglngogxy'
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


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< forgot pass email getting  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     let email
     let _id
    const emailpost=async(req,res,next)=>{
        try {email=req.body.email;
           
             newUser=await user.findOne({email:email})
            if(newUser){
            _id=newUser._id;
            await otpcheck(newUser);
                res.render('ForgotpassOtp',{_id,email,user1:true})
            }else{
                 res.send('invalid email ID')
            }
            
        } catch (error) {
            console.log(error.message);
            res.render('error500') 
        }}

    const emailpostget=async(req,res,next)=>{
        try {
            newUser=await user.findOne({email:email})
            if(newUser){
            _id=newUser._id;
            await otpcheck(newUser);
                res.render('ForgotpassOtp',{_id,email,user1:true})
            }else{
                 res.send('invalid email ID')
            }

            }
            
         catch (error) {
            console.log(error.message);
            res.render('error500') 
        }}

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<  OTP  mail varification  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const forgotpassOtpSubmit = async function (req, res, next) {
    try {
        const check = req.body.otp;
      
        id=req.body.id
        email=req.body.email
        const join = check.join('')
        if (OtpCode == join) {
       
    
          res.render('forgotpass',{id,user1:true})
        }
        else {
          message = "Otp failed"
          res.redirect('/forgotpassOtpSubmit')
      }
        
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        }
    }

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< new password enter and submit >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const forgotpasssubmit=async(req,res,next)=>{
    try {
        id=req.query.id
        cpassword=req.body.cpassword
        password=req.body.password
        if(cpassword==password){
            const newpass=await securePasswords(password);
            await user.findByIdAndUpdate({_id:id},{$set:{password:newpass}})
            res.redirect("/login")
        }
        
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        
    }}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  resend otp  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const resendOtpforForgotpass = async function (req, res, next) {
    await otpcheck();
    res.redirect('/forgotpassEmailsubmit')
  }
  
   
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   password reset  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  
  const  passwordreset=async(req,res)=>{
    try {

         curpass=req.body.current
         newpass=req.body.newpasss
         confirmpass=req.body.confirmpass
         userData=await user.findById({_id:req.session.user_id})

         if(newpass==confirmpass){
        
          const newpassword=await securePasswords(newpass);  
          const passwordMatch =await bcrypt.compare(req.body.current,userData.password)
          if(passwordMatch)
          { 
            await user.findByIdAndUpdate({_id:req.session.user_id},{$set:{password:newpassword}})
            
            return res.json({message:'password changed'})

          }else{
            
            return res.json({message:'current password mismatch'})
           
          }
         }else{
         
          return res.json({message:'confirm password mismatch'})
         
         }
      
    } catch (error) {
      console.log(error.message);
      res.render('error500')
      
    }
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< profileDataChange >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const profileDataChange= async (req,res)=>{
    try {
     
      id=req.body._id;
      name=req.body.name;
      lastname=req.body.lastname;
      Mobile=req.body.Mobile;
      const userid=req.session.user_id
      await user.findByIdAndUpdate({_id:id},{$set:{name:name,lastname:lastname,Mobile:Mobile}})
      const userpro=await user.findOne({_id:userid}).lean()
    
      req.session.name=userpro.name;
     username= req.session.name;
    //  return res.json({message:'userdata changed',userpro,username})
    // return res.json({userpro,username,message:'userdata changed'})
      const coupons= await coupon.find({expiryDate:{$gt:Date.now()}}).limit(1) 
     
       res.render('userProfile',{user:true,user1:true,username,userpro,coupons})
    } catch (error) {
      console.log(error.message);
      res.render('error500')
      
    }
  }
       

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< exporting modules  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    module.exports={
        emailpost,
        emailpostget,
        forgotpassOtpSubmit,
        forgotpasssubmit,
        passwordreset,
        resendOtpforForgotpass,
        profileDataChange
    }