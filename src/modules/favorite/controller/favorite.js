 import { StatusCodes } from "http-status-codes";
 import { ErrorClass } from "../../../utils/error.Class.js";
 import productModel from "../../../../DB/model/Product.model.js";
import userModel from './../../../../DB/model/User.model.js';



export const addToFavorite =async (req,res,next)=>{
  const productId =req.params.id
  const product =await productModel.findById(productId)
  if(!product){
   return  next(new ErrorClass('Product not found',404))
  }
  const user = await userModel.updateOne({_id:req.user._id},{
    $addToSet:{
      favourites: productId
    }
  })
  return res.json({message:'Done',result:user})
}

export const getFavorite = async (req,res,next)=>{
  const useId = req.user._id
  const user =await userModel.findById(useId).populate([
    {path: 'favourites'}
  ])
  
  return res.json({message:'Done',result:user})
}