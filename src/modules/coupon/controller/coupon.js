import cloudinary from "./../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorClass } from "./../../../utils/error.Class.js";
import couponModel from "../../../../DB/model/Coupon.model.js";

export const addCoupon = async (req, res, next) => {
  let { code,  amount ,expireDate,numOfuses } = req.body;
  const isExist = await couponModel.findOne({ code });
  if (isExist) {
    return next(
      new ErrorClass(`Duplicate coupon Name ${code}`, StatusCodes.CONFLICT));
  }

  const coupon = await couponModel.create({
    code,amount,expireDate,numOfuses,
    createdBy: req.user._id
  });
 return res.status(StatusCodes.CREATED)
    .json({ message: "Done", result:coupon, status: ReasonPhrases.CREATED });
};

export const updateCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await couponModel.findById(couponId);
  if (!coupon) {
    return next(new ErrorClass("Coupon not found ", StatusCodes.NOT_FOUND));
  }
  if (req.body.code) {
    //if code(coupon) already exists and is not owner user categor  ال اسم موجود قبلل كدا وومش بتاع كوبون دا
    const iscodeExist = await couponModel.findOne({
      code: req.body.code,_id: { $ne: couponId },});
    if (iscodeExist) {
      return next(
        new ErrorClass("code Coupon already exists", StatusCodes.CONFLICT)
      );
    }
  }
  if(req.body.amount){
    req.body.amount=req.body.amount
  }
  if(req.body.expireDate){
    req.body.expireDate=req.body.expireDate
  }
  if(req.body.numOfuses){
    req.body.numOfuses=req.body.numOfuses
  }
  req.body.createdBy = req.user._id
  const updateCoupon = await couponModel.updateOne({ _id: couponId },req.body);
  return res.status(StatusCodes.ACCEPTED).json({ message: "Done", result:updateCoupon });
};

export const deleteCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const isExist = await couponModel.findByIdAndDelete(couponId);
  if (!isExist) {
    return next(new ErrorClass("couponId not found", StatusCodes.NOT_FOUND));
  }
  return res.status(StatusCodes.ACCEPTED).json({ message: "done",result: isExist });
};

export const getAllcoupons = async (req, res, next) => {
  const coupons = await couponModel.find()
  return res.status(StatusCodes.ACCEPTED).json({ message: "Done", result:coupons });
};

export const searchByName = async (req, res, next) => {
  const { searchKey } = req.query;
  const coupons = await couponModel.find({
    name: { $regex: `${searchKey}` },
  });
  return res.status(StatusCodes.ACCEPTED).json({ message: "Done",result: coupons });
};

export const getcouponsById = async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await couponModel.findById(couponId)
  return res.status(StatusCodes.ACCEPTED).json({ message: "Done",result: coupon });
};