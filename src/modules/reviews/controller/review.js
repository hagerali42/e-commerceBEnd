
import orderModel from '../../../../DB/model/Order.model.js';
import { ErrorClass } from '../../../utils/error.Class.js';
import productModel from './../../../../DB/model/Product.model.js';
import reviewModel  from './../../../../DB/model/Review.model.js';

export const addReview =async (req, res,next) =>{
  const{ productId,rating,comment}=req.body;
  const createdBy= req.user._id;
  const product =await productModel.findById(productId);
  if(!product){
    return next(new ErrorClass('Product not found',404))
  }
  const order =await orderModel.findOne({
    userId:createdBy,
    status:"delivered",
    'products.product.productId':productId
  })
  if(!order){
    return next(new ErrorClass("You can't review this product",403))
  }
  const isReviewBeforeOnThisProduct=await reviewModel.findOne({
     createdBy,productId
  })
  if(isReviewBeforeOnThisProduct){
    return next(new ErrorClass("You can't review this product again",403))
  }

  const review = await reviewModel.create({createdBy,productId,comment,rating})
  let OldAvg=product.avgRate
  let OldRateNo= product.rateNo
  let sum =OldAvg * OldRateNo +rating
  let newAvg = sum /(OldRateNo+1)

  product.avgRate = newAvg
  product.rateNo = OldRateNo +1
  await product.save()

 return res.status(200).json({message:"Done",review})
}
export const updateReview =async (req, res,next) =>{
    const reviewId=req.params.id;
    const createdBy= req.user._id;
    const {rating ,comment}=req.body;
    const isReviewed =await reviewModel.findOne({
      createdBy,
      _id: reviewId,
    })
    if(!isReviewed){
      return next(new ErrorClass("review not found ",404))
    }
    if(rating){
      const product =await productModel.findById(isReviewed.productId)
       product.avgRate=( (product.avgRate * product.rateNo -isReviewed.rating)+rating)/product.rateNo
       await product.save()
      isReviewed.rating = rating
    }
    if(comment){
      isReviewed.comment = comment
    }
    await isReviewed.save()  
   return res.status(201).json({message:"Done",isReviewed})
  }

  export const deleteReview =async (req, res,next) =>{
    const reviewId=req.params.id;
    const createdBy= req.user._id;
    const isReviewed =await reviewModel.findOneAndDelete({
      createdBy,
      _id: reviewId,
    })
    if(!isReviewed){
      return next(new ErrorClass("review not found ",404))
    }
    const product =await productModel.findById(isReviewed.productId)
    product.avgRate=( (product.avgRate * product.rateNo -isReviewed.rating))/ (product.rateNo - 1)
    product.rateNo = product.rateNo -1
    await product.save()
   return res.status(201).json({message:"Done",isReviewed})
  }