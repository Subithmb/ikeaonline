const order=require('../models/orderModel.JS')
const user= require("../models/userModel");
const bcrypt =require("bcrypt")
var message;
const productModel=require('../models/productModel');
const razorpay=require('../controllers/paymentController');
const address=require('../models/addressModel');
const cart=require('../models/cartModel');
const session=require("express-session")
const nodemailer = require("nodemailer");
const { findById } = require("../models/wishlistModel");
var username;
const coupon=require("../models/couponModel")


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  place order  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const placeOrder=async(req,res)=>{
    try {
       
        req.session.updatedTotal=updatedTotal

        
        req.session.updatedTotal=updatedTotal
        const userid= req.session.user_id;
        const cartList=await cart.findOne({userId:userid}).lean()
        const{name,lastname,email, Mobile,city,state,pincode,landmark,paymentmethod}=req.body
        const totalAmount=req.session.totalAmount
       req.body.userId=userid
       req.body.totalAmount=totalAmount
       req.body.products=cartList.products
       req.body.discount=req.session.discountAmount
       req.body.updatedtotal= req.session.updatedTotal
       req.body.date=new Date()

       req.body.address={name,lastname,email, Mobile,city,state,pincode,landmark}

       req.body. paymentmethod=paymentmethod   

       const orderData= await order.create(req.body)

       const confirmData=await order.findOne({_id:orderData._id}).populate("products.productId").lean()
       
       req.session.orderData=confirmData

    Promise.all(cartList.products.map(({ productId, quantity }) => {
        return productModel.findOneAndUpdate(
          { _id: productId },
          { $inc: { quantity: -quantity } },).lean();
      }))

     await cart.findOneAndDelete({userId:userid})
       
      

        return res.json('success')
     
    }    catch (error) {
       console.log(error.message); 
    }
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< confirm order  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const confirmOrder=async (req,res)=>{
    try {
         username= req.session.name;
         userid= req.session.user_id;
         confirmData= req.session.orderData

        discountAmount= req.session.discountAmount

        updatedTotal= req.session.updatedTotal
       

        
         const orderData=await confirmData.products.map(({productId,Tprice,quantity})=>({
            Name:productId.productName,
            image:productId.image,
            Tprice,
            quantity
            
         }))        
            
        res.render('orderconfirm',{user1:true,user:true,username,orderData,totalAmount,confirmData,discountAmount,updatedTotal})
        
    } catch (error) {
        console.log(error.message);
    }
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< order history  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const orderhistory=async(req,res)=>{
    try { 
        username= req.session.name;
       
        const confirmData=await order.find({userId:userid}).populate("products.productId").populate('address').lean()

        const orderData =await confirmData.map((i) => {
            return i.products.map(({productId,Tprice,quantity}) => ({
              name: productId.productName,
              image: productId.image,
              Tprice,
              quantity,
            }));
          }).flat();
        
        const addressorder= await confirmData.map((i)=>{
            return i.address

        })
           
        res.render('orderhistory',{user:true,user1:true,username,addressorder,orderData,confirmData})
    } catch (error) {
        console.log(error.message); 
    }
}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< view orders user  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const viewOrders=async(req,res)=>{
    try {
        username= req.session.name;
         userid= req.session.user_id;
         confirmData= req.session.orderData
         orderid=req.query.id
        const allorder=await order.findOne({_id:req.query.id}).populate("products.productId").populate("address").lean()
        const orderhistory=allorder.products.map(({productId,Tprice,quantity}) => ({
              name: productId.productName,
              image: productId.image,
              Tprice,
              quantity,
            }));
         console.log(allorder);
         res.render('userorderdata',{user1:true,user:true,username,orderhistory,allorder})

    } catch (error) {
     console.log(error.message);  
    }
}



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<user orderlist access by admin  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const useroderview=async(req,res)=>{

    try { 
        
       
        const confirmData=await order.find().populate("products.productId").populate('address').sort({ updatedAt:-1})

        // const orderData =await confirmData.map((i) => {
        //     return i.products.map(({productId,Tprice,quantity}) => ({
             
            
        //       Tprice,
        //       quantity,
        //     }));
        //   }).flat();
        
        const addressorder= await confirmData.map((i)=>{
            return i.address

        })
          // res.send('done')
        res.render('ordermanager',{admin1:true,admin:true,addressorder,confirmData})
    } catch (error) {
        console.log(error.message); 
    }



   
}



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< admin manage order view  by admin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const userOrdermanage=async(req,res)=>{
    try {
        
         orderid=req.query.id
        const allorder=await order.findOne({_id:req.query.id}).populate("products.productId").populate("address").lean()
        const orderhistory=allorder.products.map(({productId,Tprice,quantity}) => ({
              name: productId.productName,
              image: productId.image,
              Tprice,
              quantity
            }));
          
      
         res.render('userordermanage',{admin:true,admin1:true,orderhistory,allorder})

    } catch (error) {
     console.log(error.message);  
    }
}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< order cancelling by user  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const orderCancel=async (req,res)=>{
    try {
    
       
        const cartList=await order.findOne({_Id:req.query.id}).populate("products.productId").lean()
        
        Promise.all(cartList.products.map(({ productId, quantity }) => {
            return productModel.findOneAndUpdate(
                { _id: productId },
                { $inc: { quantity:quantity } },).lean();
            }))
            
         
            const orders=await order.findOne({_id:req.query.id})
       
       await order.findOneAndUpdate({_id:req.query.id},{$set:{orderStatus:'cancelled'}})
      
          res.json("order cancelled")
       
      
    } catch (error) {
        console.log(error.message);  
    }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< initiate pay >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


        const initiatePay=async(req,res)=>{
            try {
               
                const userid= req.session.user_id;
                
                const cartList=await cart.findOne({userId:userid}).lean()
                
                const{name,lastname,email, Mobile,city,state,pincode,landmark,paymentmethod}=req.body
                
                const totalAmount= req.session.updatedTotal
                
                discountAmount=req.session.discountAmount
                updatedTotal=req.session.updatedTotal
                
                req.body.userId=userid
                req.body.totalAmount=totalAmount
                req.body.products=cartList.products
                req.body.address={name,lastname,email,Mobile,city,state,pincode,landmark}
                req.body.updatedtotal=updatedTotal
                req.body.discount=discountAmount
                req.body.date=new Date()
                const orderData= await order.create(req.body)
                
                
       couponCode=req.session.couponCode
   

         await coupon.findOneAndUpdate({couponCode:couponCode},{$inc:{couponLimit:-1}})
         await coupon.findOneAndUpdate({couponCode:couponCode}, { $push: { users: { userId: userid, couponStatus: 'invalid' } } },{ new: true });
        
        const razorData=await razorpay.initiateRazorpay(orderData._id,totalAmount)


       await order.findOneAndUpdate({_id:orderData._id},{$set:{orderId:razorData.id}})

       const confirmData=await order.findOne({_id:orderData._id}).populate("products.productId").lean()
       req.session.orderData=confirmData
        return res.json({message:'success',razorData,orderData,totalAmount})

            } catch (error) {
            console.log(error.message);  
            }
        }
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< payment varification and delete cart& decrese product    >>>>>>>>>>>>>>>>>>>>>>>>>>>>


   const verifyPayment= async(req,res,next)=>{
    try {
        const userid= req.session.user_id; 
             success= await razorpay.validate(req.body);
             if (success)
             { 
                 orderData = await order.findOneAndUpdate({ orderId: req.body.razorData.id }, {paymentStatus: "success" }).lean();
                
               
                Promise.all(orderData.products.map(({ productId, quantity }) => {
                    return productModel.findOneAndUpdate({ _id: productId },{ $inc: { quantity: -quantity } },).lean();
                  }))

                  await cart.findOneAndDelete({userId:userid})
                return res.json({ status: "true" });
             }
             else
             {
                 await order.findOneAndUpdate({ orderId: req.body['razorData[id]'] }, { paymentStatus: "failed" });
                 return res.json({ status: "failed" });
                 }


            } catch (error) {
                console.log(error.message);  
            }
        }


        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< order dispatched  >>>>>>>>>>>>>>>>>>>>>

        const dispatched=async(req,res)=>{
            try {
                id=req.query.id
                await order.findOneAndUpdate({_id:id},{$set:{orderStatus:'dispatched'}})
             
                return res.json({ status: "dispatched" });
                
            } catch (error) {
                console.log(error.message);   
            }
        }

        
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< order delivered  >>>>>>>>>>>>>>>>>>>>>

        const delivered=async(req,res)=>{
            try {
                id=req.query.id
                await order.findOneAndUpdate({_id:id},{$set:{orderStatus:'delivered'}})
             
                return res.json({ status: "delivered" });
                
            } catch (error) {
                console.log(error.message);   
            }
        }
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< order pending  >>>>>>>>>>>>>>>>>>>>>

        const pending=async(req,res)=>{
            try {
                id=req.query.id
                await order.findOneAndUpdate({_id:id},{$set:{orderStatus:'pending'}})
             
                return res.json({ status: "pending" });
                
            } catch (error) {
                console.log(error.message);   
            }
        }
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ordered >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        const ordered=async(req,res)=>{
            try {
                id=req.query.id
                await order.findOneAndUpdate({_id:id},{$set:{orderStatus:'ordered'}})
                return res.json({ status: "ordered" });
                
            } catch (error) {
                console.log(error.message);   
            }
        }

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< module   >>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports={
    placeOrder,
    confirmOrder,
    orderhistory,
    viewOrders,
    userOrdermanage,
    useroderview,
    orderCancel,
    initiatePay,
    verifyPayment,
    dispatched,
    ordered,
    pending,
    delivered
}
