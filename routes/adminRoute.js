const express=require("express");
const admin_route=express();
const bodyparser=require("body-parser");
// const path =require('path')
const session =require("express-session")
admin_route.use(bodyparser.json())
admin_route.use(bodyparser.urlencoded({extended:true}))
const multerMiddileware =require('../middleWare/multerMiddleware')
const adminController=require("../controllers/adminController")
const categoryController=require("../controllers/categoryController")
const productController=require("../controllers/productController")
const bannerController=require("../controllers/bannerController")
const orderController=require("../controllers/orderController")
const adminauth=require('../middleWare/adminauth')
const couponController=require('../controllers/couponontroller')


//<<<<<<<<<<<<<<<<<<<<< admin path setting  >>>>>>>>>>>>>>>>>>>>>>>>>

admin_route.set("views",'./views/admin')  

// <<<<<<<<<<<<<<<<<<<<<<session >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//admin_route.use(session({secret:"key",resave: false,saveUninitialized: false,unset: 'destroy'}))

// admin_route.use(session({
//   secret: 'session_key',
//   resave: false, // set to false to prevent session data from being resaved on every request
//   saveUninitialized: false // set to false to prevent uninitialized sessions from being saved
// }));
//<<<<<<<<<<<<<<<<<<<  admin login page >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

 admin_route.get('/admin',adminController.loadLogin);

//<<<<<<<<<<<<<<<<<<<<<<<<< admin signin submit>>>>>>>>>>>>>>>>>>>>>>>>>>>>

 admin_route.post('/adminsignin',adminController.verifyLogin);

//<<<<<<<<<<<<<<<<<<<<  admin dashboard >>>>>>>>>>>>>>>>>>>>>>>>>>>

 admin_route.get('/dashboard',adminauth.isadmin,adminController.loadDashboard);

// <<<<<<<<<<<<<<<<<<<<<<<<<<< user listing  >>>>>>>>>>>>>>>>>>>>>>>>>>>>

  admin_route.get('/userManage',adminauth.isadmin,adminController.userList);

// <<<<<<<<<<<<<<<<<<<<<< admin usermanagement-delete >>>>>>>>>>>>>>>>>>>>

   admin_route.get('/deleteuser',adminauth.isadmin,adminController.deleteUser);
   

//<<<<<<<<<<<<<<<<<< add user in usermanagement page getting>>>>>>>>>>>>>>>>>>>>>>

  admin_route.get('/adduser',adminauth.isadmin,adminController.addUser);

  //<<<<<<<<<<<<<<<<< add user in usermanagement page getting>>>>>>>>>>>>>>>>>>>>

  admin_route.post('/adduser',adminauth.isadmin,adminController.addUserPost);

//<<<<<<<<<<<<<<<<<<<<<<<< edit user info geeting page>>>>>>>>>>>>>>>>>>>>>>>>>>>

  admin_route.get('/editUser',adminauth.isadmin,adminController.editUserData);

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  edit user and submit  >>>>>>>>>>>>>>>>>>>>>>>>>
  
   admin_route.post('/editSubmition',adminauth.isadmin,adminController.editUserPost);

  // <<<<<<<<<<<<<<<<<<  user id blocking>>>>>>>>>>>>>>>>>>>>>>>>>>

   admin_route.get('/blockUser',adminauth.isadmin,adminController.blockUser);

  //<<<<<<<<<<<<<<<<<<<<<<<<<  user unblocking>>>>>>>>>>>>>>>>>>>>>>>>>

   admin_route.get('/unblockUser',adminauth.isadmin,adminController.unBlockUser);

   

  // <<<<<<<<<<<<<<<<<<<category manage>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   admin_route.get('/category',adminauth.isadmin,categoryController.categoryManage);

  // <<<<<<<<<<<<<<<<<< get add category page>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  
   admin_route.get('/addcategory',adminauth.isadmin,categoryController.categoryGet);

  //<<<<<<<<<<<<<<<<<<<<<< category post to data base>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  
   admin_route.post('/addCategory',adminauth.isadmin,categoryController.addingcategory);
   
  // <<<<<<<<<<<<<<<<<<<<<<<<< delete category >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  
  admin_route.get('/deleteCategory',adminauth.isadmin,categoryController.deleteCategory);

  // <<<<<<<<<<<<<<<<<<<<<<<<<<edit category>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  
  admin_route.get('/editcategory',adminauth.isadmin,categoryController.editCategory);

  //<<<<<<<<<<<<<<<<<<<<<<< edit category posting>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 
  admin_route.post('/editCategory',adminauth.isadmin,categoryController.editcategoryPost);

  //<<<<<<<<<<<<<<<<<<<<<<<<< product manage>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

 
  admin_route.get('/productManage',adminauth.isadmin,productController.productManage);

  //<<<<<<<<<<<<<<<<<<<<<<<<<< add product page >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  admin_route.get('/AddProducts',adminauth.isadmin,productController.productAdding);

  //<<<<<<<<<<<<<<<<<<<<<<<<<< product adding>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   admin_route.post('/AddProduct',adminauth.isadmin,multerMiddileware.array('image',3),productController.addnewProduct);

  // <<<<<<<<<<<<<<<<<<<<<<<<<<< delete products>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

 
   admin_route.get('/deleteProduct',adminauth.isadmin,productController.deleteProducts);

  //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<edit product>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

 
   admin_route.get('/editproduct',adminauth.isadmin,productController.editproduct);

  // <<<<<<<<<<<<<<<<<<<<<<<<product update and post>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

 
   admin_route.post('/submitproduct',adminauth.isadmin,productController.editproductPost);

  //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<product image only editing  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


   admin_route.post('/submitproductphotos',adminauth.isadmin,multerMiddileware.array('image',3),productController.editproductPhotos);

   
   //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  product listing>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   admin_route.get('/listProduct',adminauth.isadmin,productController.productListing);

  // <<<<<<<<<<<<<<<<<<<<<<<<<<< product unlist>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   admin_route.get('/unlistProduct',adminauth.isadmin,productController.productUnlist);

  // <<<<<<<<<<<<<<<<<<<<<<<<<<< list category>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   admin_route.get('/listCategory',adminauth.isadmin,categoryController.categoryListing);
   
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< unlist category>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   admin_route.get('/unlistCategory',adminauth.isadmin,categoryController.categoryUnlist);

// <<<<<<<<<<<<<<<<<<<<<<admin sign up>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //  admin_route.post("/addAdmin",adminController.addAdmin);
  //  admin_route.get("/add",adminController.add);

//  admin_route.get('*',(req,res)=>{
//     res.redirect('/admin');
//  });


// <<<<<<<<<<<<<<<<<<<<<<<<<< banner manage page>>>>>>>>>>>>>>>>>>>>>>

admin_route.get('/addbanner',adminauth.isadmin,bannerController.addbanner) 

admin_route.get('/banner',adminauth.isadmin,bannerController.bannerManage) 
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<banner adding >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
admin_route.post('/bannersubmit',multerMiddileware.single('image'),bannerController.addingbanner) 

// <<<<<<<<<<<<<<<<<<<<<<< delete banner  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


admin_route.get('/deletebanner',adminauth.isadmin,bannerController.deletebanner)

// <<<<<<<<<<<<<<<<<<<<<<<< order manage  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


admin_route.get('/orderViewList',adminauth.isadmin,orderController.useroderview) 

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<order list  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


admin_route.get('/userOrders',adminauth.isadmin,orderController.userOrdermanage) 

admin_route.post("/ordercanceling",adminauth.isadmin,orderController.orderCancel);
admin_route.get("/dispatched",adminauth.isadmin,orderController.dispatched);
admin_route.get("/delivered",adminauth.isadmin,orderController.delivered);
admin_route.get("/pending",adminauth.isadmin,orderController.pending);
admin_route.get("/ordered",adminauth.isadmin,orderController.ordered);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  coupon manage  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< add coupon  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


admin_route.get('/addCoupon',adminauth.isadmin,couponController.renderAddCoupon) 

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< coupon posting >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


admin_route.post('/createCoupon',adminauth.isadmin,couponController.addCoupon) 

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< coupon manage >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

admin_route.get('/couponViewList',adminauth.isadmin,couponController.couponManage) 

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< delete coupon  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

admin_route.get('/deleteCoupon',adminauth.isadmin,couponController.deleteCoupon) 

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  admin log out>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   admin_route.get('/adminlogout',adminController.adminLogout);

module.exports=admin_route