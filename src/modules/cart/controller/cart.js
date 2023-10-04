 import { StatusCodes } from "http-status-codes";
 import { ErrorClass } from "../../../utils/error.Class.js";
 import productModel from "./../../../../DB/model/Product.model.js";
  import cartModel from '../../../../DB/model/Cart.model.js'

  export const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return next(new ErrorClass("Product not found", StatusCodes.NOT_FOUND));
    }
    if (product.stock < quantity) {
      await productModel.updateOne({ _id: productId },{
        $addToSet: { wishlist: req.user._id },
        }
      );
      return next(new ErrorClass("Out of stock", StatusCodes.BAD_REQUEST));
    }
    let cart =await cartModel.findOne({userId: req.user._id})
    let productIndex=cart.products.findIndex((ele) =>{
      return ele.product == productId
    })
    if (productIndex == -1) {
      cart.products.push({
          product:productId,
          quantity: quantity
      })
    }else{
      cart.products[productIndex].quantity=quantity
    }
    await cart.save()
    return res.status(StatusCodes.CREATED).json({message:'Done',cart})
  };


  export const getCartuser = async (req, res, next) => {
    let cart =await cartModel.findOne({userId: req.user._id})
    if(!cart) {
      return next(new ErrorClass("Not Founded",404));
    }   
    return res.status(StatusCodes.OK).json({message:'Done',cart})
  };
