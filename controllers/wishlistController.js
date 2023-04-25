
// const  wishlist=require('../models/wishlistModel');
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



            //<<<<<<<<<<<<<<<<<<<<< WISH LIST>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

       const wishList =async(req,res)=>{
            try {
                const userid= req.session.user_id;
                
                const userData=await user.findById({_id:userid}).lean()
                req.session.name=userData.name;
               username= req.session.name;
                  
        wishlistData = await wishlist.findOne(
            { userId: userid }
        ).populate("products.productId").lean();
        

        if(wishlistData){
            if(!wishlistData.products[0]){
               
                res.render('emptywishlist',{user:true,user1:true,username})
            }
        

       const stocks = await Promise.all(wishlistData.products.map( async(i) => {
            
           const stock = await product.findOne({ _id: i.productId._id }).lean();
            return stock;
        }));
       
            res.render('wishlist', { user:true,user1:true,username,wishlistData,stocks})
        }
        else {
           
            res.render('emptywishlist',{user:true,user1:true,username})
    } }
        catch (error) {
           console.log(error.message);
           res.render('error500')
        }}
       


                //<<<<<<<<<<<<<<<<<<<<< add to wishlist>>>>>>>>>>>>>>>>>>>>>>>>

        const addToWishlist=async(req,res)=>{
            try {
               productnew= req.body.product
             
                const userid= req.session.user_id;
                const wishlistadata=await wishlist.findOne({userId:userid}).lean()
               
                if(wishlistadata){
               
                  const wishlistproduct= await wishlist.findOne({userId:userid,"products.productId":productnew}).lean()
            

                  if(wishlistproduct){
                    await  wishlist.updateOne({userId:userid},{$pull:{products:{productId:productnew}}})
                    return res.json({message:' Item removed '}) 
                   
                  }else{
                    await wishlist.findOneAndUpdate({userId:userid},{$addToSet:{products:{productId:productnew}}})
                    return res.json({message:' Item added '}) 
                   
                  } }


                else{
                    await wishlist.create({userId:userid,products:{productId:productnew}})
                    return res.json({message:'New Item added '}) 
                  
                    }
                
            } catch (error) {
                console.log(error.message);
                res.render('error500')
                }}


                //<<<<<<<<<<<<<<<<<<<<<wishlist data removing>>>>>>>>>>>>>>>>>>>>>>>>>>>

                const wishlistRemove=async(req,res)=>{
                    try {
                       const productid = req.query.id
                        const userid= req.session.user_id;
                       
                    await wishlist.updateOne({userId: userid},{$pull:{products:{productId:productid}}})
                    
                    res.redirect('/WishList')
                    } catch (error) {
                        console.log(error.message);
                        res.render('error500')
                        
                    }}



                // <<<<<<<<<<<<<<<<<<<<<<<modules exporting>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                module.exports={
                    wishList,
                    addToWishlist,
                    wishlistRemove
                }
