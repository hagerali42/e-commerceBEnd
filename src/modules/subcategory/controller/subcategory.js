import slugify from "slugify";
import categoryModel from "../../../../DB/model/Category.model.js";
import subcategoryModel from "../../../../DB/model/SubCategory.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorClass } from "../../../utils/error.Class.js";
import { ApiFeature } from "../../../utils/apiFeatures.js";
import productModel from "../../../../DB/model/Product.model.js";


 export const addSubCategory = async (req, res, next) => {
    let { name ,categoryId} = req.body;
    const userId=req.user._id
    const categoryfound = await categoryModel.findById(categoryId);
    if (!categoryfound) {
      return next(new ErrorClass("Category not found",StatusCodes.NOT_FOUND));
    }
    const nameExist =await subcategoryModel.findOne({name})
    if (nameExist) {
        return next(new ErrorClass("name of subCategory exists",StatusCodes.BAD_REQUEST));
      }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `E-commerce/category/Subcategory/` }
    );
    const Subcategory = await subcategoryModel.create({
      name,
      slug:slugify(name),
      categoryId,
      image: { secure_url, public_id }, 
      createdBy : userId,
    });

   return res.status(StatusCodes.CREATED).json({ message: "Done",result: Subcategory, status: ReasonPhrases.CREATED });
  };       
  export const updatesubCategory = async (req, res, next) => {
    const { subcategoryId } = req.params;
    const subcategory = await subcategoryModel.findById(subcategoryId);
    if (!subcategory) {
      return next(new ErrorClass("subCategory not found",StatusCodes.NOT_FOUND));
    }
    if (req.body.name) {
      //if name(prodect) already exists and is not owner user categor  ال اسم موجود قبلل كدا وومش بتاع كاتجورى دا
      const isNameExist = await subcategoryModel.findOne({name: req.body.name,_id: { $ne: subcategoryId },});
      if (isNameExist) {
        return next(new ErrorClass("Name already exists",StatusCodes.BAD_REQUEST));
      }
      req.body.slug = slugify(req.body.name);
    }
    // if wanted update subcategory IMAGE................................
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `E-commerce/category/Subcategory/` }
      );
      await cloudinary.uploader.destroy(subcategory.image.public_id);
      req.body.image = { secure_url, public_id };
    }

    const updatesubCategory = await subcategoryModel.updateOne(
      { _id: subcategoryId },
      req.body
    );
    return res.status(StatusCodes.OK).json({ message: "Done",result: updatesubCategory });
  };
  
  export const deletesubCategory = async (req, res, next) => {
    const { subcategoryId } = req.params;
    const isExist = await subcategoryModel.findByIdAndDelete(subcategoryId);
    if (!isExist) {
      return next(new ErrorClass("subcategory not found",StatusCodes.NOT_FOUND));
    }
    await cloudinary.uploader.destroy(isExist.image.public_id);

    const products= await productModel.find({subcategoryId})
    for (let i = 0; i < products.length; i++) {
      await cloudinary.uploader.destroy(products[i].image.public_id);
    }
      //delelt items of subcategory and product in DD
    await productModel.deleteMany({subcategoryId})
    return res.status(StatusCodes.ACCEPTED).json({ message: "done",result: isExist });
  };

  export const getAllSubcategories = async(req, res, next) => {  
    // console.log(req.params);
    const mongooseQuery = subcategoryModel.find(req.params)
    .populate([{path:'categoryId'}])
    
    const api=new ApiFeature(mongooseQuery,req.query)
    .pagenation().sort().select().filter().search()

    const subCategory=await api.mongooseQuery

    return res.status(StatusCodes.ACCEPTED).json({result:subCategory})
   };


  export const getSubcategoryById= async(req, res, next) => {
    const { subcategoryId}=req.params 
    const subcategories = await subcategoryModel.findById(subcategoryId)
    .populate([{path:'categoryId'}])
    return res,status(StatusCodes.OK).json({result:subcategories})
  };

