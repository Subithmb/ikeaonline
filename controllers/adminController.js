const user=require('../models/userModel');
const category=require('../models/categoryModel');
const product=require('../models/productModel');
const admin=require('../models/adminModel');
const bcrypt=require('bcrypt');
const { findOne } = require('../models/userModel');
const multer=require("multer");
const bodyParser = require('body-parser');
const order=require('../models/orderModel.JS')


// bcrypt
const securePassword= async(password)=>{ try {
    const passwordHash = await bcrypt.hash(password,9);
    return passwordHash;
 } catch (error) {
     console.log(error.message);
     }}
    var  adminname;
// admin loginpage
const loadLogin =async(req,res)=>{
    try {
        res.render('login',{user1:true});
    } catch (error) {
        console.log(error.message);
        
    }
}

// signup admin

    
// const addAdmin=async(req,res)=>{
//     try {
//      console.log(req.body);
//       const spassword=await securePassword(req.body.password);

//      const newadmins=await new admin({
//       name:req.body.name,
     
//       email:req.body.email,
     
//       password:spassword
      
//      })
      
      
//         const categoryData= await newadmins.save();
        
      
       
//     } catch (error) { console.log(error.message);}}

//     const add=(req,res)=> {
// res.render('adminsignup',{user1:true})

//     }


// admin login

const verifyLogin =async(req,res)=>{
   
    try { 
        let adminMail =req.body.adminMail;
        let adminPassword =req.body.adminPassword;
         const adminData = await admin.findOne({email:adminMail})
      if(adminData){
        const passwordMatch =await bcrypt.compare(adminPassword,adminData.password)
       if(passwordMatch){
        if(adminData.is_admin ===0){
            res.render('login',{user1:true,message:"email or password incorrect"})  
        }else{
           
             req.session.admin=adminData._id;
             req.session.name=adminData.name;
             adminname= req.session.name;
         
            //  res.render('dashboard',{admin1:true})}
             res.redirect('dashboard')}
         }else{
         res.render('login',{user1:true,message:"email or password incorrect"})}}
        else{res.render('login',{user1:true,message:"email or password incorrect"})}
        } catch (error) {
        console.log(error.message);}}

// admin dashboard home

const loadDashboard =async(req,res)=>{
    try { let a=0;let b=0;let c=0;let p=0;let d=0;
        let mo=0;let tu=0;let we=0;let th=0;let fr=0;let sa=0;let su=0;

        const orderData=await order.find({orderStatus:'delivered'}).populate("products.productId").lean();

for (let i = 0; i < orderData.length; i++) {

    const category = orderData[i].products.filter((value)=>{
        return value.productId.categoryiD
    })
   
   
}
     
        
        for (i=0;i<orderData.length;i++){
            const date = new Date(orderData[i].date);
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                console.log(dayOfWeek.toUpperCase());
            if(dayOfWeek.toUpperCase()=="MONDAY"){
                mo++;
              }
            if(dayOfWeek.toUpperCase()=="TUESDAY"){
                tu++;
              }
            if(dayOfWeek.toUpperCase()=="WEDNESDAY"){
                we++;
              }
            if(dayOfWeek.toUpperCase()=="THURSDAY"){
                th++;
              }
            if(dayOfWeek.toUpperCase()=="FRIDAY"){
                fr++;
              }
            if(dayOfWeek.toUpperCase()=="SATURDAY"){
                sa++;
              }
            if(dayOfWeek.toUpperCase()=="SUNDAY"){
                su++;
              }

        }

        const orderD=await order.find()
        for(i=0;i<orderD.length;i++){
       
       if(orderD[i].orderStatus=="orderd"){
         a++;
       }
       if(orderD[i].orderStatus=="cancelled"){
         b++;
       }
       if(orderD[i].orderStatus=="dispatched"){
         c++;
       }
       if(orderD[i].orderStatus=="pending"){
         p++;
       }
       if(orderD[i].orderStatus=="delivered"){
         d++;
       }}

        res.render('dashboard',{admin1:true,adminname,orderData,a,b,c,d,p,mo,tu,we,th,fr,sa,su});}
     catch (error) {console.log(error.message);}}

// user manager

const userList=async(req,res)=>{
    try {
       const userData=await user.find().lean()
        res.render('userManage',{admin1:true,userData});
    } catch (error)
     {console.log(error.message); }
}

// add user getting

const addUser=async(req,res)=>{
    try {res.render('AddUser',{user1:true}); }
     catch (error) {console.log(error.message); }
}

// add user posting

const addUserPost=async(req,res)=>{
    try {
      const name=req.body.firstName;
      const lastname=req.body.lastName;
       const email=req.body.email;
       const Mobile=req.body.mobile;
       const password=req.body.password;
        const spassword=await securePassword(password);
        const newUser=new user({name:name,lastname:lastname, email:email, Mobile:Mobile, password:spassword,is_admin:0,})
        const userData= await newUser.save();

       if(userData)
       { res.redirect('/userManage') }

       else
       {res.render("AddUser",{user1:true,message:"your registration has been failed"}) }

    } catch (error) { console.log(error.message);}}

//Edit user geeting info 

const editUserData=async(req,res)=>{
    try {
        const id=req.query.id
    const userData=await user.findById({_id:id})
    if(userData){
        res.render('editUser',{user1:true,
            id:userData.id,
           name:userData.name,
           lastName:userData.lastname,
           email:userData.email,
           mobile:userData.Mobile,
           password:userData.password,
        });
    }else{
        res.redirect('/userManage')
    }
    } catch (error) {
        console.log(error.message);
    }}

// admin user edit submitting

 const editUserPost =async(req,res)=>{
    try { 
        await user.findByIdAndUpdate({_id:req.body.id},{$set:{
            name:req.body.firstName,
            lastname:req.body.lastName,
            email:req.body.email,
            Mobile:req.body.mobile
        }})
    res.redirect('/userManage')
    } catch (error) {
        console.log(error.messaage);
      }
 }
 
 // user deleteing
 
const deleteUser=async(req,res)=>{
    try {
        const id= req.query.id;
       await user.deleteOne({_id:id})
       res.redirect('/userManage')
    } catch (error) {
        console.log(error.message);
        
    }}
    
// user blocking

const blockUser=async(req,res)=>{
    try {
      const userData= await user.findOne({_id:req.query.id})
     if(userData){
      await user.updateOne({_id:userData.id},{$set:{status:true}})
       res.redirect('/userManage')
     }
    } catch (error) {
        console.log(error.message);
        
    }}


// unblocking

const unBlockUser=async(req,res)=>{
    try {
    
      const userData= await user.findOne({_id:req.query.id})
      if(userData){
          if(userData.status){
            await user.updateOne({_id:userData.id},{$set:{status:false}})
            res.redirect('/userManage')
        }}
    } catch (error) {
        console.log(error.message);
        }}

//     // category manage
    
//     const categoryManage=async(req,res)=>{
//         try {
//             const categoryData=await category.find().lean()
//            res.render('category',{admin1:true,categoryData})
//         } catch (error) {
//             console.log(error.message);
//         }}
        
//     // add category get page 

//     const categoryGet=(req,res)=>{
//         try {
//            res.render('addCategory',{user1:true})
//         } catch (error) {
//             console.log(error.message);
            
//         }}
    
//         // category adding to data base


//         const addingcategory=async(req,res)=>{
//     try {
//       const categoryName=req.body.category;
      
//       const Newcategory=new category({categoryName})
//         const categoryData= await Newcategory.save();
        
//        if(categoryData)
//        { res.redirect('/category') }
       
//        else
//        {res.redirect('/addCategory') }
       
//     } catch (error) { console.log(error.message);}}
    
//     // Remove category
    
    
// const deleteCategory=async(req,res)=>{
//     try {
//         const id= req.query.id;
//        await category.deleteOne({_id:id})
//        res.redirect('/category')
//     } catch (error) {
//            console.log(error.message);
        
//     }}
    

//     // category editing

    
//     const editCategory=async(req,res)=>{
//     try {
//         const id=req.query.id
//         const categoryData=await category.findById({_id:id})
//     console.log(categoryData);
//     if(categoryData){
//         res.render('editCategory',{user1:true,
//             id:categoryData.id,
//             category:categoryData.categoryName});
//     }else{
//         res.redirect('/category')
//     }
//     } catch (error) {
//             console.log(error.message);
//     }}

//         // edit category post
//         const editcategoryPost =async(req,res)=>{
//             try {
//                await category.findByIdAndUpdate({_id:req.body.id},{$set:{categoryName:req.body.category}})
//              res.redirect('/category')
//             } catch (error) {
//             console.log(error.messaage);
//               }
//          }
     

    // // Add-products

    // const productManage=async(req,res)=>{
    //     try {
    //          const productData=await product.find().lean()
            
    //         res.render('product',{admin1:true,productData})
    //     } catch (error) {
    //         console.log(error.message);
    //         }}

    //         // adding new products

    //         const productAdding=async(req,res)=>{
    //         try {
    //         const categoryData=await category.find().lean()
    //         console.log(categoryData._id);
    //          res.render('addproduct',{user1:true,categoryData})
    //             } catch (error) {
    //         console.log(error.message);
    //                 }}

    //         // product adding to database
    // const addnewProduct=async(req,res)=>{
    // try {
    //     const products=await new product({
    //         productName:req.body.productName,
    //          price:req.body.price,
    //          category:req.body.category,
    //          quantity:req.body.quantity,
    //          image:req.file.filename

    //     })
     
    //     const productData= await products.save();
        
    //    if(productData)
    //    { res.redirect('/productManage') }

    //    else
    //    {res.redirect("/AddProducts") }

    // } catch (error) { console.log(error.message);}}

    // // product deleting

    // const deleteProducts=async(req,res)=>{
    //     try {
    //         const id= req.query.id;
    //        await product.deleteOne({_id:id})
    //        res.redirect('/productManage')
    //     } catch (error) {
    //            console.log(error.message);
            
    //     }}

   
        
    //     // product editing
        
        
    //     const editproduct=async(req,res)=>{
    //         try {
    //             const id=req.query.id
    //         const categoryData=await category.find().lean()
    //         const productData=await product.findById({_id:id})
           
    //     if(productData){
    //         res.render('editProduct',{user1:true,categoryData,
               
    //             id:productData.id,
    //             productName:productData.productName,
    //             price:productData.price,
    //             category:productData.category,
    //             quantity:productData.quantity,
    //             Image:productData.image
    //         });
    //     }else{
    //         res.redirect('/productManage')
    //     }
    //     } catch (error) {
    //             console.log(error.message);
    //     }}
        
    //     // product update and post
    //     const editproductPost =async(req,res)=>{
    //         try {
    //           await product.findByIdAndUpdate({_id:req.body.id},{$set:{productName:req.body.productName,
    //             price:req.body.price,
    //             category:req.body.category,
    //             quantity:req.body.quantity,
    //             image:req.file.filename}})
              
    //          res.redirect('/productManage')
    //         } catch (error) {
    //         console.log(error.messaage);
    //     }
    // }
     
    // admin log out

const adminLogout =async(req,res)=>{
try {
    req.session=null;
    adminname=null;
    // req.session=null;
    res.render('login',{user1:true});
} catch (error) {
    console.log(error.message);
    }}


    module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    userList,
    addUser,
    addUserPost,
    editUserData,
    editUserPost,
    deleteUser,
    blockUser,
    unBlockUser,
    // addAdmin,add,
    // categoryGet,
    // addingcategory,
    // categoryManage,
    // deleteCategory,
    // editCategory,
    // productManage,
    // productAdding,
    // addnewProduct,
    // editcategoryPost,
    // deleteProducts,
    adminLogout,
    // editproduct,
    // editproductPost
}