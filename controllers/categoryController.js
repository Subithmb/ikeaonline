// const user=require('../models/userModel');
const category=require('../models/categoryModel');
// const product=require('../models/productModel');
// const admin=require('../models/adminModel');
 const { findOne } = require('../models/userModel');

    // category manage
    
    const categoryManage=async(req,res)=>{
        try {
            const categoryData=await category.find().lean()
           res.render('category',{admin1:true,categoryData})
        } catch (error) {
            console.log(error.message);
            res.render('error500')
        }}
        
    // add category get page 

    const categoryGet=(req,res)=>{
        try {
           res.render('addCategory',{user1:true})
        } catch (error) {
            console.log(error.message);
            res.render('error500')
            
        }}
    
        // category adding to data base


        const addingcategory=async(req,res)=>{
    try {
      const categoryName=req.body.category;
      const categoryDatas= await category.findOne({categoryName:categoryName})
      if(categoryDatas){
        res.render('addCategory',{user1:true,message:"already exist"})
        
      }else{

          const Newcategory=new category({categoryName})
    
            const categoryData= await Newcategory.save();
            
           if(categoryData)
           { res.redirect('/category') }
           
           else
           {res.redirect('/addCategory') }
      }
       
    } catch (error) { console.log(error.message);     res.render('error500')}}
    
    // Remove category
    
    
const deleteCategory=async(req,res)=>{
    try {
        // const id= req.query.id;
        const id= req.query.id;
       await category.deleteOne({_id:id})
       res.redirect('/category')
    } catch (error) {
           console.log(error.message);
           res.render('error500')
    }}
    

    // category editing

    
    const editCategory=async(req,res)=>{
    try {
        const id=req.query.id
        const categoryData=await category.findById({_id:id})
    console.log(categoryData);
    if(categoryData){
        res.render('editCategory',{user1:true,
            id:categoryData.id,
            category:categoryData.categoryName});
    }else{
        res.redirect('/category')
    }
    } catch (error) {
            console.log(error.message);
            res.render('error500')
    }}

        // edit category post
        const editcategoryPost =async(req,res)=>{
            try {
               await category.findByIdAndUpdate({_id:req.body.id},{$set:{categoryName:req.body.category}})
             res.redirect('/category')
            } catch (error) {
            console.log(error.messaage);
            res.render('error500')
            }}
            

              
// unlist product

const categoryUnlist=async(req,res)=>{
    try {
      const categoryData= await category.findOne({_id:req.query.id})
     
     if(categoryData){
        console.log(categoryData.id);
      await category.updateOne({_id:categoryData.id},{$set:{is_status:false}})
       res.redirect('/category')
     }
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        
    }}


// listing

const categoryListing=async(req,res)=>{
    try {
    
      const categoryData= await category.findOne({_id:req.query.id})
      if(categoryData){
          if(categoryData.is_status==false){
            await category.updateOne({_id:categoryData.id},{$set:{is_status:true}})
            res.redirect('/category')
        }}
    } catch (error) {
        console.log(error.message);
        res.render('error500')
        }}

     

         module.exports={
          categoryGet,
          addingcategory,
          categoryManage,
          deleteCategory,
          editcategoryPost,
          editCategory,
          categoryListing,
          categoryUnlist
        }