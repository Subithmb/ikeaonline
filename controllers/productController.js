const user = require("../models/userModel");
const category = require("../models/categoryModel");
const product = require("../models/productModel");
const admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const { findOne } = require("../models/userModel");
const multer = require("multer");
const bodyParser = require("body-parser");

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< manage-products >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const productManage = async (req, res) => {
  try {
    const productData = await product.find().populate("category").lean();

    res.render("product", { admin1: true, productData });
  } catch (error) {
    console.log(error.message);
    res.render("error500");
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< adding new products >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const productAdding = async (req, res) => {
  try {
    const categoryData = await category.find().lean();

    res.render("addproduct", { user1: true, categoryData });
  } catch (error) {
    console.log(error.message);
    res.render("error500");
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    product adding to database  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const addnewProduct = async (req, res) => {
  try {
    const img = req.files.map((file) => file.filename);

    const products = await new product({
      productName: req.body.productName,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity,
      image: img,
    
    });

    const productData = await products.save();

    if (productData) {
      res.redirect("/productManage");
    } else {
      res.redirect("/AddProducts");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error500");
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< product deleting  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const deleteProducts = async (req, res) => {
  try {
    const id = req.query.id;
    await product.deleteOne({ _id: id });
    res.redirect("/productManage");
  } catch (error) {
    console.log(error.message);
    res.render("error500");
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< product editing  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const editproduct = async (req, res) => {
  try {
    const id = req.query.id;
    const categoryData = await category.find().lean();
    const productData = await product
      .findById({ _id: id })
      .populate("category")
      .lean();

    const { _id } = productData;

    const currentCategory = productData.category.categoryName;
    const currentCategoryid = productData.category._id;
    if (productData) {
      const [ar1, ar2, ar3] = productData.image;

      res.render("editProduct", {
        user1: true,
        ar1,
        ar2,
        ar3,
        _id,
        categoryData,
        id: productData.id,
        productName: productData.productName,
        price: productData.price,
        category: productData.category,
        quantity: productData.quantity,
        Image: productData.image,
        currentCategory,
        currentCategoryid,
      });
    } else {
      res.redirect("/productManage");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error500");
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< product update and post  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const editproductPost = async (req, res) => {
  try {
    const a = await product.findByIdAndUpdate(
      { _id: req.query.id },
      {
        $set: {
          productName: req.body.productName,
          price: req.body.price,
          category: req.body.category,
          quantity: req.body.quantity,
        },
      }
    );
    res.redirect("/productManage");
  } catch (error) {
    console.log(error.messaage);
    res.render("error500");
  }
};

const editproductPhotos = async (req, res) => {
  try {
    const imgs = req.files.map((file) => file.filename);

    await product.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: { image: imgs } }
    );
    nu = await product.findOne({ _id: req.query.id });
    const [img1, img2, img3] = nu.image;

    res.render("editProduct", { user1: true, img1, img2, img3 });
  } catch (error) {
    console.log(error.messaage);
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< unlist product  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const productUnlist = async (req, res) => {
  try {
    const productData = await product.findOne({ _id: req.query.id });

    if (productData) {
      await product.updateOne(
        { _id: productData.id },
        { $set: { status: false } }
      );
      res.redirect("/productManage");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error500");
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< listing  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const productListing = async (req, res) => {
  try {
    const productData = await product.findOne({ _id: req.query.id });
    if (productData) {
      if (productData.status == false) {
      
        await product.updateOne(
          { _id: productData.id },
          { $set: { status: true } }
        );
        res.redirect("/productManage");
      }
    }
  } catch (error) {
    console.log(error.message);
    res.render("error500");
  }
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<module exporting  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports = {
  deleteProducts,
  productManage,
  productAdding,
  addnewProduct,
  editproduct,
  editproductPost,
  productListing,
  productUnlist,
  editproductPhotos,
};
