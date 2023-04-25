const user= require("../models/userModel");
const bcrypt =require("bcrypt")
var message;
const productModel=require('../models/productModel');
const address=require('../models/addressModel');
const cartmodel=require('../models/cartModel');
const session=require("express-session")
const nodemailer = require("nodemailer");
const { findById } = require("../models/wishlistModel");
var username;



//<<<<<<<<<<<<<<<<<<<<<<< add item to cart>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

const addCart=async(req,res,next)=>{
  
  try {
    
    const productid = req.body.product;
    const userid= req.session.user_id;
   const cart=await cartmodel.findOne({userId:userid}).lean();
  //  const cartstock=await cartmodel.findOne({userId:userid,}).lean();

   const stock = await productModel.findOne({_id:productid}).lean()
 const wish=await productModel.findOne({"products.productId":req.body.product}).lean()
if(stock){
      price=stock.price

      quantity=stock.quantity
    }else{
     price=wish.price
      quantity=wish.quantity
    }


    if(stock.quantity<=0 || wish.quantity<=0 ){
       
      return res.json({message:'sorry product is out of stock',quantity})
    }
    if(cart){
     const productexist = await cartmodel.findOne({userId:userid,"products.productId":productid})
      if(productexist ){
        
        // await cartmodel.updateOne({userId:userid,"products.productId":productid},{$inc:{"products.$.quantity":1,"products.$.Tprice":price}})
        return res.json({message:'cart1 ',quantity}) 
      }else{
          await cartmodel.findOneAndUpdate({userId:userid},{$push:{products:{productId:productid,quantity:1,Tprice:price}}});}
          return res.json({message:'cart2',quantity}) 
    }else{
    
      await cartmodel.create({userId:userid,products:{productId:productid,quantity:1,Tprice:price}})
      return res.json({message:'cart 3',quantity}) 
    }
     
  } catch (error) {
    console.log(error.message);
    res.render('error500')
    
  }}

  //<<<<<<<<<<<<<<<<<<<<<<<<<< cart page rendering >>>>>>>>>>>>>>>>>>>>>>>>>>>>


const cartData =async (req, res) => {
  try {  
  let  userid= req.session.user_id;
  username= req.session.name;
 
  let cartDatas= await cartmodel.findOne(
      { userId:userid}
  ).populate("products.productId").lean();

  
  if(cartDatas){
    
    if (Array.isArray(cartDatas.products) && cartDatas.products.length !=0 && cartDatas.products.length !=null ) {
      
      let price=cartDatas.Tprice
       var totalAmount;

    const stocks = await Promise.all(cartDatas.products.map( async(i) => {  
      const stock = await productModel.findOne({ _id: i.productId._id }).lean();
      return stock; }));

    const cartList =await Promise.all(cartDatas.products.map(({
      productId,quantity,Tprice}) => ({   
        productName:productId.productName,
        price:productId.price,
        image:productId.image,
        Tprice,
        quantity,
        productId
    })))
   
    totalAmount = await Amount(cartList)
   
 res.render('cart', { user:true,user1:true,username,cartList,totalAmount,stocks})
  }
  else{
    res.render('emptyCart',{user:true,user1:true,username})
  }

}
   else {
    res.render('emptyCart',{user:true,user1:true,username})
  }
  } catch (error) {
     console.log(error.message);
     res.render('error500')

  }}


//<<<<<<<<<<<<<<<<< total amount  function  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  function Amount (cartList){
        total = cartList.reduce((acc, curr) => {
            acc +=(curr.price* curr.quantity);
            
            return acc;
        }, 0);
        return total;
    }

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<cart item quantity inc >>>>>>>>>>>>>>>>>>>>>>>>>




const cartItemInc  = async (req, res, next) => {
  try {
       stock = await productModel.findOne({ _id: req.body.product}, { _id: 0, quantity: 1 }).lean();
       
  if (stock.quantity<=0) {
   return res.json({message:'sorry the product is out of stock click the link below to move back to cart'})            
  }
  const quantities = parseInt(req.body.quantity)
 
  userId =req.session.user_id;
   await cartmodel.updateOne({ userId: userId, "products.productId": req.body.product },  { "products.$.quantity": quantities });
   cartData = await cartmodel.findOne(
      { userId: userId, "products.productId": req.body.product}
  ).populate("products.productId").lean();
  price = (cartData.products[req.body.index].productId.price - cartData.products[req.body.index]) * cartData.products[req.body.index].quantity
  quantity = cartData.products[req.body.index].quantity;

  return res.json({ message: "the product is incremented",quantity,price})
  } catch (error) {
    res.render('error500')
      next(error); 
  }}


  //<<<<<<<<<<<<<<<<<<<<<Cart data removing>>>>>>>>>>>>>>>>>>>>>>>>>>>
 
  const cartRemove=async(req,res)=>{
    try {
       const productid = req.query.id
        const userid= req.session.user_id;
  
        await cartmodel.updateOne({userId: userid},{$pull:{products:{productId:productid}}})
   
    res.redirect('/userCart')
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        
    }}


// ============================================================quantity increment=========================================
    const increment=async(req,res)=>{
      try {
        const productId = req.body.id
        const quantity= parseInt(req.body.check);
       
        const userid= req.session.user_id;
        const s = await productModel.findOne({ _id: productId}).lean();
        const stock =parseInt(s.quantity)

        if(quantity < stock){
          await cartmodel.updateOne({userId: userid,'products.productId':productId}, { $inc: { 'products.$.quantity': 1 } }).then(async(value)=>{
            const qu=   await cartmodel.findOne({userId:userid})
            const que = await cartmodel.findOne({userId:userid}).populate("products.productId").lean();
           const value1 = qu.products.find((values)=>{
            return values.productId==productId
           })


           const price1 = s.price
           const price2 = value1.quantity
           const price =price1* price2
           await cartmodel.updateOne({userId:userid,'products.productId':productId},{$inc:{"products.$.Tprice":s.price}}).then(async(value)=>{
            const cartList =await Promise.all(que.products.map(({
              productId,quantity,Tprice}) => ({   
                productName:productId.productName,
                price:productId.price,
                image:productId.image,
                Tprice,
                quantity,
                productId
            })))


            totalAmount = await Amount(cartList)


            return res.json({value1,stock,success:true,totalAmount,price})

           })
          })

        }
        else if(quantity >= stock){
         
          const price =stock*s.price
          await cartmodel.updateOne({userId: userid,'products.productId':productId}, { $set: { 'products.$.quantity': stock,"products.$.Tprice":price } })
          const qu=   await cartmodel.findOne({userId:userid})
         
        const value1 = qu.products.find((values)=>{
          return values.productId==productId
         })
         return res.json({value1,success:false})
        }
        else{
         
          
          const qu=   await cartmodel.findOne({userId:userid})
         
        const value1 = qu.products.find((values)=>{
          return values.productId==productId
         })
         return res.json({value1,success:false})
        }
      } catch (error) {
        
          res.render('error500')
          
      }}
   
      
      // =======================================================quatity decrement=================================================
    const decrement=async(req,res)=>{
      try {
     
          const productId = req.body.id
          const quantity= parseInt(req.body.quantity);
          console.log('-------');
         
          const userid= req.session.user_id;
          const qu=   await cartmodel.findOne({userId:userid})
          const que = await cartmodel.findOne({userId:userid}).populate("products.productId").lean();
          const s = await productModel.findOne({ _id: productId}).lean();
          const price1 = s.price
      
          const qfind = qu.products.find((value)=>{
            return value.productId==productId
          })
        
         if(qfind.quantity== 1 || qfind.quantity<=1) {
          console.log('---data--');
          const value1 = qu.products.find((value)=>{
            return value.productId==productId
          })
         
          const price2 = 1
          const price =price1
          await cartmodel.updateOne({userId: userid,'products.productId':productId}, { $set: { 'products.$.quantity': 1,"products.$.Tprice":price1 } })
          return res.json({value1,message:' Item removed ',totalAmount,price})
        
         }else{
      await cartmodel.updateOne({userId: userid,'products.productId':productId}, { $inc: { 'products.$.quantity': -1 } }).then(async(value)=>{
        const value1 = qu.products.find((values)=>{
                    return values.productId==productId
                  })
                  const price2 = value1.quantity
                  const price =price1* price2
       await cartmodel.updateOne({userId:userid,'products.productId':productId},{$inc:{"products.$.Tprice":-price1}}).then(async(value)=>{
        const cartList =await Promise.all(que.products.map(({
          productId,quantity,Tprice}) => ({   
            productName:productId.productName,
            price:productId.price,
            image:productId.image,
            Tprice,
            quantity,
            productId
        })))


        totalAmount = await Amount(cartList)
       

        return res.json({value1,message:' Item removed ',totalAmount,price})
       })
      })

    }
      } catch (error) {
          console.log(error.message);
          res.render('error500')
          
      }}
  
// <<<<<<<<<<<<<<<<<<<<<<<<<<  user checkout page  >>>>>>>>>>>>>>>>>>>>>>>>>

const userCheckout= async(req,res)=>{
  try {
    const userid= req.session.user_id;
    const userData=await user.findOne({_id:userid}).lean()
    // req.session.name=userData.name;
     username= req.session.name;
   
    const useraddress=await address.findOne({userId:userid}).lean()
    if(useraddress){

    const cartData = await cartmodel.findOne({userId:userid}).populate("products.productId").lean();
 
    const cartList =await Promise.all(cartData.products.map(({
      productId,quantity,Tprice}) => ({   
        productName:productId.productName,
        price:productId.price,
        image:productId.image,
        Tprice,
        quantity,
        productId
    })))
    totalAmount = await Amount(cartList)

    const userDatas=await user.findOne({_id:userid})
    discountAmount=0
    updatedTotal=totalAmount-discountAmount
   
    req.session.discountAmount=discountAmount
    // req.session.wallet=userDatas.wallet
   
    // if(userDatas.wallet<updatedTotal){
    //   wallet=userDatas.wallet
    //   req.session.wallet=wallet
    //   updatedTotal=updatedTotal-userDatas.wallet
    //   await user.findOneAndUpdate({_id:req.session.user_id},{$set:{wallet:0}})
    // }
    // else{
    //   console.log('gffdgfdgfdgfdgdfgfdg');
    //   updatedwallet=userData.wallet-updatedTotal
      
    //    await user.findOneAndUpdate({_id:req.session.user_id},{$set:{wallet:updatedwallet}})
    //   wallet=updatedTotal
    //   updatedTotal=0
    //   req.session.wallet=wallet
    //   req.session.updatedTotal=0
    // }


   
    req.session.updatedTotal=updatedTotal
    req.session.cartlist=cartList
    req.session.totalAmount=totalAmount
    selectedAddress=useraddress.address[0]
  
    res.render('checkout',{admin:true,user:true,user1:true,username,cartList,totalAmount,userData,selectedAddress,updatedTotal,discountAmount})
  }else{
    const cartData = await cartmodel.findOne({userId:userid}).populate("products.productId").lean();
 
    const cartList =await Promise.all(cartData.products.map(({
      productId,quantity,Tprice}) => ({   
        productName:productId.productName,
        price:productId.price,
        image:productId.image,
        Tprice,
        quantity,
        productId
    })))
    totalAmount = await Amount(cartList)
    discountAmount=0
    updatedTotal=totalAmount-discountAmount
   
    req.session.discountAmount=discountAmount
   
    req.session.updatedTotal=updatedTotal
    req.session.cartlist=cartList
    req.session.totalAmount=totalAmount
   
      res.redirect('/addaddress')

  }

    
  } catch (error) {
    console.log(error.message);
    res.render('error500')
  }
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<modules exporting>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports={
    addCart,
    cartData,
    cartItemInc,
    cartRemove,
    increment,
    decrement,
    userCheckout
}


