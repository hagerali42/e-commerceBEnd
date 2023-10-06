import slugify from "slugify";
import cloudinary from "./../../../utils/cloudinary.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorClass } from "./../../../utils/error.Class.js";
import { ApiFeature } from './../../../utils/apiFeatures.js';
import subcategoryModel from "../../../../DB/model/SubCategory.model.js";
import productModel from './../../../../DB/model/Product.model.js';

export const addCategory = async (req, res, next) => {
  const userId=req.user._id
  let { name } = req.body;
  const isExist = await categoryModel.findOne({ name });
  if (isExist) {
    return next(
      new ErrorClass("This name already exists", StatusCodes.BAD_REQUEST)
    );
  }
  const slug = slugify(name);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "E-commerc/category" }
  );
  const category = await categoryModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    createdBy:userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Done",result: category, status: ReasonPhrases.CREATED });
};

export const updateCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new ErrorClass("Category not found", StatusCodes.NOT_FOUND));
  }

  if (req.body.name) {
    //if name(prodect) already exists and is not owner user categor  ال اسم موجود قبلل كدا وومش بتاع كاتجورى دا
    const isNameExist = await categoryModel.findOne({
      name: req.body.name,
      _id: { $ne: categoryId },
    });
    if (isNameExist) {
      return next(
        new ErrorClass("Name already exists", StatusCodes.BAD_REQUEST)
      );
    }
    req.body.slug = slugify(req.body.name);
  }

  // if wanted update category IMAGE................................
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,{ folder: "E-commerc/category" }
    );
    await cloudinary.uploader.destroy(category.image.public_id);

    req.body.image = { secure_url, public_id };
  }

  const updateCategory = await categoryModel.updateOne(
    { _id: categoryId },
    req.body
  );
  return res.status(StatusCodes.OK).json({ message: "Done", updateCategory });
};

export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const isExist = await categoryModel.findByIdAndDelete(categoryId);
  if (!isExist) {
    return next(new ErrorClass("category not found", StatusCodes.NOT_FOUND));
  }
  await cloudinary.uploader.destroy(isExist.image.public_id);
  
    //delelt imae of subcategory and product in cloudinery
  const subcategories= await subcategoryModel.find({categoryId})
  for (let i = 0; i < subcategories.length; i++) {
    await cloudinary.uploader.destroy(subcategories[i].image.public_id); 
  }
  const products= await productModel.find({categoryId})
  for (let i = 0; i < products.length; i++) {
    await cloudinary.uploader.destroy(products[i].image.public_id);
  }
    //delelt items of subcategory and product in DD
  await subcategoryModel.deleteMany({categoryId})
  await productModel.deleteMany({categoryId})

  return res.status(StatusCodes.ACCEPTED).json({ message: "done",result: isExist });
};


export const getAllcategories = async (req, res, next) => {
  const mongooseQuery = categoryModel.find()
  .populate([{ path: "subcategories" }]);
  
  const api=new ApiFeature(mongooseQuery,req.query)
  .pagenation(categoryModel).search().filter().sort().select()

  const categories = await api.mongooseQuery
  return res.status(StatusCodes.ACCEPTED).json({ message: "Done",result: categories });
};

export const getcategoriesById = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryModel
    .findById(categoryId)
    .populate([{ path: "subcategories" }]);
  return res.status(StatusCodes.ACCEPTED).json({ message: "Done",result: category });
};
