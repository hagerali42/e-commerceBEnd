import slugify from 'slugify';
import cloudinary from '../../../utils/cloudinary.js';
import brandModel from './../../../../DB/model/Brand.model.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ErrorClass } from '../../../utils/error.Class.js';
import { ApiFeature } from '../../../utils/apiFeatures.js';
import productModel from './../../../../DB/model/Product.model.js';


  export const addBrand = async (req, res, next) => {
    const { name } = req.body;
    const userId=req.user._id
    const isExist = await brandModel.findOne({ name });
    if (isExist) {
      return next(new ErrorClass("This name already exists",StatusCodes.CONFLICT));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "E-commerc/brand" }
    );
    const brand = await brandModel.create({
      name,
      slug : slugify(name),
      image: { secure_url, public_id },
      createdBy:userId,
    });
    return res.status(StatusCodes.CREATED).json({ message: "Done", result:brand,});
  };

  export const updateBrand = async (req, res, next) => {
    const { brandId } = req.params;
    const brand = await brandModel.findById(brandId);
    if (!brand) {
      return next(new ErrorClass("brand not found", StatusCodes.NOT_FOUND));
    }
    if (req.body.name) {
      //if name(prodect) already exists and is not owner user categor  ال اسم موجود قبلل كدا وومش بتاع كاتجورى دا
      const isNameExist = await brandModel.findOne({ name: req.body.name,_id: { $ne: brandId },});
      if (isNameExist) {
        return next(
          new ErrorClass("Name already exists", StatusCodes.CONFLICT)
        );
      }
      req.body.slug = slugify(req.body.name);
    }
    // if wanted update brand IMAGE................................
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,{ folder: "E-commerc/brand" }
      );
      await cloudinary.uploader.destroy(brand.image.public_id);
      req.body.image = { secure_url, public_id };
    }
  
    const updateBrand = await brandModel.updateOne({ _id: brandId }, req.body);
    return res.status(StatusCodes.OK).json({ message: "Done",result: updateBrand });
  };
  
  export const deleteBrand = async (req, res, next) => {
    const { brandId } = req.params;
    const isExist = await brandModel.findByIdAndDelete(brandId);
    if (!isExist) {
      return next(new ErrorClass("Brand not found", StatusCodes.NOT_FOUND));
    }
    await cloudinary.uploader.destroy(isExist.image.public_id);

    const products= await productModel.find({brandId})
    for (let i = 0; i < products.length; i++) {
      await cloudinary.uploader.destroy(products[i].image.public_id);
    }
      //delelt items of subcategory and product in DD
    await productModel.deleteMany({brandId})
    return res.status(StatusCodes.ACCEPTED).json({ message: "done", result:isExist });
  };



  
  export const getAllBrand = async (req, res, next) => {
    const mongooseQuery =  brandModel.find()
    const api=new ApiFeature(mongooseQuery,req.query)
    .pagenation(brandModel).sort().select().filter().search() 
    const brands = await api.mongooseQuery
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done",result: brands });
  };
  
  export const getBrandById = async (req, res, next) => {
    const { brandId } = req.params;
    const brand = await brandModel.findById(brandId)
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done",result: brand });
  };