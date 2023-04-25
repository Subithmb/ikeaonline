    const coupon=require("../models/couponModel")
    const cart=require("../models/cartModel")
    const user= require("../models/userModel");


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< manage coupon >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

    const couponManage =async(req,res)=>{
        try {
            const allcoupons=await coupon.find({}).lean();

            res.render('couponManage',{admin1:true,admin:true,allcoupons})
            
        } catch (error) {
           console.log(error.message); 
        }
    }


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  add coupon render  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   const renderAddCoupon= (req, res, next) => {
        try {
            res.render('addCoupon',{user1:true});
        } catch (error) {
            console.log(error.message); 
        } }


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  add coupon  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    const addCoupon= async (req, res, next) => {
        try {
           console.log(req.body.couponCode);
            couponIdExist = await coupon.findOne({ couponCode:req.body.couponCode}).lean();
console.log(couponIdExist);
        if( couponIdExist){

            res.render('addCoupon',{user1:true, message: "couponExist" });
        }else{  
            await coupon.create(req.body)

         res.redirect('/couponViewList');
        }
        } catch (error) {
            console.log(error.message); 
        }}
  


    const renderEditCoupon= async (req, res, next) => {
        try {
             id = req.params.id
        couponData = await coupon.find({ _id: req.params.id }).lean();
        couponData[0].expiryDate = couponData[0].expiryDate.toISOString().substring(0, 10);
        couponData = couponData[0];
        res.render('admin/editCoupon', { id, couponData});
        } catch (error) {
            console.log(error.message); 
        }
       }


   const editCoupon= async (req, res, next) => {
        try {
            await coupon.findOneAndUpdate({ _id: req.params.id }, { $set: { couponName:req.body.couponName,discountAmount:req.body.discountAmount,minAmount:req.body.minAmount,expiryDate:req.body.expiryDate,couponCode:req.body.couponCode} })
        res.redirect('/admin/couponData');
        } catch (error) {
            console.log(error.message);  
        }
        
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  delete Coupon  >>>>>>>>>>>>>>>>>>>>>>>>>>>


    const deleteCoupon= async (req, res, next) => {
        try {
             await coupon.deleteOne({ _id: req.query.id });
        res.redirect('/couponViewList');
        } catch (error) {
            console.log(error.message);  
        }
       }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

     
   const validateCoupon=async (req, res, next) => {
       try { 
           userId = req.session.user_id;
           cartList= req.session.cartlist
           totalAmount=req.session.totalAmount
           
        couponExist = await coupon.findOne({couponCode:req.body.couponId,"users.userId": userId }).lean();
        console.log(req.body.couponId);
        coupons = await coupon.findOne({ couponCode:req.body.couponId }).lean();
        currentDate = new Date();
        
        if (coupons && coupons.couponLimit>0 )
            
        { if(couponExist){
                
             return res.json({ message: 'coupon already Used' });    
          
        }
        if (currentDate > coupons.expiryDate) {
            
             return res.json({ message: " coupon Expired" });   
            
        }

         if (totalAmount < coupons.minAmount){
          
              return res.json({ message: "your total bill is under the minimum amount please purchase more" });
          
         }

       
            req.session.couponCode=coupons.couponCode
            updatedTotal = totalAmount - coupons.discountAmount;
            
            // wallet= req.session.wallet
            discountAmount=coupons.discountAmount
            updatedTotal = totalAmount - coupons.discountAmount;
            
            // wallet=wallet-discountAmount
            const cartList=await cart.findOne({userId:userId})
            req.session.updatedTotal=updatedTotal
            req.session.discountAmount= discountAmount
            // await user.findByIdAndUpdate({_id:userId},{$inc:{wallet:discountAmount}})
            console.log( req.session.updatedTotal);
            return res.json({ message: "success",updatedTotal,discountAmount});
    
        }
      
         return res.json({ message:"coupon Invalid or coupon limit reached" });
        } catch (error) {
            console.log(error.message); 
        }
        
      }

    module.exports={
        renderAddCoupon,
        deleteCoupon,
        editCoupon,
        renderEditCoupon,
        addCoupon,
        couponManage,
        validateCoupon


    }




    