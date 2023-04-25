 const  banner=require('../models/bannerModel');
const wishlist=require("../models/wishlistModel")

const user= require("../models/userModel");
const bcrypt =require("bcrypt")
var message;
const product=require('../models/productModel');
const category=require('../models/categoryModel');
const session=require("express-session")
const nodemailer = require("nodemailer");
const { populate } = require("../models/wishlistModel");
var username;


// <<<<<<<<<<<<<<<<<<< banner  manage >>>>>>>>>>>>>>>>>>>>>>>>>

const bannerManage=async(req,res)=>{
    try {
        const bannerData =await banner.find().lean()
        console.log(bannerData);
        res.render('banner',{admin:true,admin1:true,bannerData})
    } catch (error) {
        console.log(error.message);   res.render('error500')
        
    }
}
// <<<<<<<<<<<<<<<<<<<<  add Banner  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const addbanner=async(req,res)=>{
    try {
        res.render('addBanner',{user1:true})
    } catch (error) {
        console.log(error.message);   res.render('error500')
        
    }
}

           // product adding to database
const  addingbanner=async(req,res)=>{
    try {
        // const img=req.files.map((file)=>file.filename)
    
        const bannerData=await new banner({
            bannerName:req.body.bannerName,
            discription:req.body.discription,
             image:req.file.filename
    
        })
     
        const banneerDatas= await bannerData.save();
        
       if(banneerDatas)
       { res.redirect('/banner') }
    
       else
       {res.redirect("/Addbanner") }
    
    } catch (error) { console.log(error.message);   res.render('error500')}}

    // <<<<<<<<<<<<<<<<<<<<<<<  banner deletion  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    
const deletebanner = async (req, res) => {
    try {
      const id = req.query.id;
      await banner.deleteOne({ _id: id });
      res.redirect("/banner");
    } catch (error) {
      console.log(error.message);
      res.render("error500");
    }
  };

    
    module.exports={
        addingbanner,
        bannerManage,
        addbanner,
        deletebanner

    }