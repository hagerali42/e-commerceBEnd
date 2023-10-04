import slugify from "slugify";
import productModel from "./../../../../DB/model/Product.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import categoryModel from "../../../../DB/model/Category.model.js";
import subcategoryModel from "./../../../../DB/model/SubCategory.model.js";
import brandModel from "./../../../../DB/model/Brand.model.js";
import { ErrorClass } from "./../../../utils/error.Class.js";
import QRCode from "qrcode";
import { ApiFeature } from './../../../utils/apiFeatures.js';

export const addProduct = async (req, res, next) => {
  const isNameExist = await productModel.findOne({ name: req.body.name });
  if (isNameExist) {
    isNameExist.stock += Number(req.body.quantity);
    await isNameExist.save();
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done", result: isNameExist });
  }
  const isCategoryExist = await categoryModel.findById(req.body.categoryId);
  if (!isCategoryExist) {
    return next(new ErrorClass(" category not found", StatusCodes.NOT_FOUND));
  }
  const issubCategoryExist = await subcategoryModel.findById(
    req.body.subcategoryId
  );
  if (!issubCategoryExist) {
    return next(
      new ErrorClass(" Subcategory not found", StatusCodes.NOT_FOUND)
    );
  }
  const isBrandExist = await brandModel.findById(req.body.brandId);
  if (!isBrandExist) {
    return next(new ErrorClass(" Brand not found", StatusCodes.NOT_FOUND));
  }
  req.body.slug = slugify(req.body.name);

  if (req.body.sizes) {
    req.body.sizes = JSON.parse(req.body.sizes);
  }
  if (req.body.colors) {
    req.body.colors = JSON.parse(req.body.colors);
  }
  if (req.body.quantity) {
    req.body.stock = req.body.quantity;
  }
  req.body.description = req.body.description;
  // req.body.stock = Number(req.body.quantity);
  req.body.paymentPrice =req.body.price - (req.body.price * ((req.body.discount || 0) / 100)) ;

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,{ folder: "E-commerc/product/image" });
  req.body.image = { secure_url, public_id };

  if (req.files.coverImages.length) {
    const coverImages = [];
    for (let i = 0; i < req.files.coverImages.length; i++) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.coverImages[i].path,
        { folder: "E-commerc/product/cover" }
      );
      coverImages.push({ secure_url, public_id });
    }
    req.body.coverImages = coverImages;
  }
 
  req.body.QRcode = await QRCode.toDataURL(JSON.stringify({
      name: req.body.name,
      description: req.body.description,
      imgUrl: req.body.image.secure_url,
      price: req.body.price,
      paymentPrice: req.body.paymentPrice,
    })
  );
  req.body.createdBy = req.user._id
  const product = await productModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ message: "Done", result: product});
};


export const updateProduct = async (req, res, next) => {
  const { name ,productId,categoryId ,subcategoryId ,brandId ,price ,discount}=req.body
  
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new ErrorClass(" peoduct not found", StatusCodes.NOT_FOUND));
  }
   //check if category &brand
  if(categoryId &&subcategoryId){
    if(!await subcategoryModel.findOne({_id:subcategoryId ,categoryId})){
      return next(new ErrorClass("in-valid category or sub category id", StatusCodes.NOT_FOUND));  
    }
  }
  if(brandId){
    if(!await brandModel.findOne({_id:brandId})){
      return next(new ErrorClass("in-valid brand id", StatusCodes.NOT_FOUND));  
    }
  }
//uodate slug
  if (name) {
    req.body.slug = slugify(name);
  }
  
//update price
 if(price && discount){
  req.body.paymentPrice =Number.parseFloat(price -(price *((discount)/100))).toFixed(2)
 }else if (price){
  req.body.paymentPrice =Number.parseFloat(price -(price *((product.discount)/100))).toFixed(2)
 }else if (discount){
  req.body.paymentPrice =Number.parseFloat(product.price -(product.price *((discount ||0)/100))).toFixed(2)

 }

  if (req.body.quantity) {
    req.body.stock = req.body.quantity;
  }
  if (req.body.description) {
    req.body.description = req.body.description;
  }


  if (req.files?.image?.length) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.image[0].path,{ folder: "E-commerc/product/image" });
    await cloudinary.uploader.destroy(product.image.public_id)
    req.body.image = { secure_url, public_id };
  
  }

  if (req.files.coverImages?.length) {
    req.body.coverImages = [];
    for (let i = 0; i < req.files.coverImages.length; i++) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.coverImages[i].path,
        { folder: "E-commerc/product/cover" }
      );
      //delete old cover images
    for (let i = 0; i < product.coverImages.length; i++) {
        const public_id = product.coverImages[i].public_id;
        cloudinary.uploader.destroy(public_id);
      }
      req.body.coverImages .push({ secure_url, public_id });
    }
    req.body.coverImages = coverImages;
  }

  req.body.updatedBy = req.user._id
  const updateProduct = await productModel.updateOne({_id:product._id},req.body,{new:true});
  return res.status(201).json({ message: "Done", result: updateProduct});
};

export const deletProduct = async (req, res, next) => {
  const {productId}=req.params
  
  const product = await productModel.findByIdAndDelete(productId);
  if (!product) {
    return next(new ErrorClass(" peoduct not found", StatusCodes.NOT_FOUND));
  }

   await cloudinary.uploader.destroy(product.image.public_id)
 
 if (product.coverImages?.length) {
      //delete old cover images
    for (let i = 0; i < product.coverImages.length; i++) {
        const public_id = product.coverImages[i].public_id;
        cloudinary.uploader.destroy(public_id);
      }
    }
  return res.status(201).json({ message: "Done"});
};

export const getAllProductes = async (req, res, next) => {
  const mongooseQuery= productModel.find()
   const apiFeature=new ApiFeature(mongooseQuery,req.query)
   .pagenation(productModel)
   .filter()
   .search()
   .select()

   const products =await apiFeature.mongooseQuery
   return res.status(StatusCodes.ACCEPTED).json({
     message: "Done", 
     result: products ,
     count:apiFeature.queryData.count,
     totalPages:apiFeature.queryData.totalPages,
     next:apiFeature.queryData.next,
     previous:apiFeature.queryData.previous,
    });

};
