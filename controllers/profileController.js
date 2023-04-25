const user=require('../models/userModel');
const category=require('../models/categoryModel');
const product=require('../models/productModel');
const admin=require('../models/adminModel');
const address=require('../models/addressModel');
const bcrypt=require('bcrypt');
const { findOne } = require('../models/userModel');
const multer=require("multer");
const bodyParser = require('body-parser');
var cartList=0;

//<<<<<<<<<<<<<<<<<<<<   bcrypt >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const securePassword= async(password)=>{ try {
    const passwordHash = await bcrypt.hash(password,9);
    return passwordHash;
 } catch (error) {
     console.log(error.message);
     }}



 //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<get add address page  >>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    const addaddresspage=async(req,res)=>{
        try {
            res.render('addAddress',{user1:true})
            
        } catch (error) {
            console.log(error.message);
            
        }
    }
     
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< adding address >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const addnewaddress = async (req, res) => {
    try {
        const userid= req.session.user_id;
    const body=req.body;
        addressData=await address.findOne({userId:userid}).lean()
        if(addressData){
       await address.findOneAndUpdate({userId:userid},{$push:{address:{$each:[body],$slice:-4 }}},{new:true})
       res.redirect('/selectaddress')
       
   }else{
          await address.create({userId:userid,address:body})
           res.redirect('/selectaddress')
       
        
          }
    } catch (error) {
      console.log(error.message);
      res.render("error500");
    }
  };


  const selectaddress = async(req,res)=>{
    try {

    
      const userid= req.session.user_id;
    const userData=await user.findOne({_id:userid}).lean()
     req.session.name=userData.name;
    username= req.session.name;
    cartList=req.session.cartlist
    totalAmount=req.session.totalAmount
    updatedTotal=req.session.updatedTotal
    discountAmount=req.session.discountAmount
    const useraddress=await address.find({userId:userid}).lean()
      res.render('selectAddress',{user1:true,user:true,useraddress,username,cartList,totalAmount,userData,updatedTotal,discountAmount})
    } catch (error) {
      console.log(error.message);
      res.render("error500");
    }
  }

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< selecting address >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  const selectaddressis=async(req,res)=>{
    try {
      a=req.query.index
      const userid= req.session.user_id;
      const userData=await user.findOne({_id:userid}).lean()
       req.session.name=userData.name;
      username= req.session.name;
      cartList=req.session.cartlist
      totalAmount=req.session.totalAmount
      updatedTotal=req.session.updatedTotal
      discountAmount=req.session.discountAmount
      
     
    const select=  await address.findOne({userId:userid}).lean()
    const selectedAddress=select.address[a]
   
     res.render('checkout',{user:true,user1:true,username,selectedAddress,discountAmount,updatedTotal,cartList,totalAmount})
    } catch (error) {
      console.log(error.message);
      res.render("error500");
    }
  }



 
 module.exports={
    addaddresspage,
    addnewaddress,
    selectaddress,
    selectaddressis,
   
 } 