const mongoose=require("mongoose");
mongoose.set('strictQuery', true);
const express=require("express");
const app=express();
const path =require("path");
const hbs=require("express-handlebars");
const handlebars=require("handlebars");
const user_route = require("./routes/userRoute");
const admin_route = require("./routes/adminRoute");
const session =require("express-session")
require("dotenv").config()

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< server connection >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const port= process.env.PORT||3000
mongoose.connect(process.env.db_Connection)
app.listen(port,()=>
{console.log('server running....')
});

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< session  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

admin_route.use(session({
  secret: process.env.session_key,
  resave: false, // set to false to prevent session data from being resaved on every request
  saveUninitialized: false // set to false to prevent uninitialized sessions from being saved
}));

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  view engine setting  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

 app.set('view engine', 'hbs');

// app.engine("hbs",
//   hbs.engine({
//     extname: "hbs",
//     defaultLayout: "layout",
//     layoutsDir: __dirname + "/views/layouts/",
//     partialsDir: __dirname + "/views/partials/",
//   })
// );


app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    // Add the helper function here
  // Add the helper function here


  helpers: {
    isEqual: function(arg1, arg2, options) {
      return (arg1 === arg2) ? (options.fn ? options.fn(this) : '') : (options.inverse ? options.inverse(this) : '');
    },
    eq: function(arg1, arg2, options) {
  
      return (arg1 === arg2) ? (options.fn ? options.fn(this) : '') : (options.inverse ? options.inverse(this) : '');
    },
    sliceDate: function(date) {
      return date.toLocaleString();
    },
   
   
      pagination: function(totalPages, currentPage, options) {
       
        let result = '';
        currentPage = parseInt(currentPage); // Convert to number
        totalPages = parseInt(totalPages);
        if (currentPage > 1) {
          result += '<span  > <a class="me-3 text-danger fw-bold" href="?page=' + (currentPage - 1) + '">Previous</a> </span>'; // Add previous page link
        }
        for (let i = 1; i <= totalPages; i++) {
          result += '<span class="product__pagination"> <a  class="m-2 bg-success text-white rounded-circle p-2" href="?page=' + i + '">' + i + '</a> </span> ';
        }
        if (currentPage < totalPages) {
          result += '<span > <a class="text-danger fw-bold" href="?page=' + (currentPage + 1) + '">Next</a> </span>'; // Add next page link
        }
        return new handlebars.SafeString(result);
      }
    
    
  }





  })
);


//for loop hbs



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< public folder setting  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.use(express.static(path.join(__dirname,'public')));




//<<<<<<<<<<<<<<<<<<< url path printer   >>>>>>>>>>>>>>>>>>>>>> 

app.use((req,res,next)=>{
  console.log(req.method+req.originalUrl);
  next();
})


// <<<<<<<<<<<<<<<<<<<<<<<<<for user routes  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const userRoute =require("./routes/userRoute")
app.use('/',user_route)


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   for admin routes  >>>>>>>>>>>>>>>>>>>>>>>>>>>

 
const adminroute =require("./routes/adminRoute")
app.use('/',admin_route)