import cartModel from "../../../../DB/model/Cart.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { createInvoice } from "../../../utils/createpdf.js";
import { ErrorClass } from "../../../utils/error.Class.js";
import orderModel from "./../../../../DB/model/Order.model.js";
import Stripe from "stripe";
import path from 'path'
import { fileURLToPath } from 'url'
import sendEmail from "../../../utils/email.js";
const stripe = new Stripe(process.env.stripKey);
const __dirname = path.dirname(fileURLToPath(import.meta.url))




export const createOrder = async (req, res, next) => {
  let { products, address, phone, note, coupon, paymentMethod } = req.body;
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!products) {
    products = cart.products;
    if (!products.length) {
      return next(new ErrorClass(`Cart is empty`, 404));
    }
  }

  if (coupon) {
    const isCouponExist = await couponModel.findOne({ code: coupon });
    if (!isCouponExist) {
      return next(new ErrorClass(`Coupon ${coupon} not found`, 404));
    }
    if (
      isCouponExist.expireDate < Date.now() ||
      isCouponExist.numOfuses <= isCouponExist.usedBy.length
    ) {
      return next(new ErrorClass(`Coupon ${coupon} Expired`, 403));
    }
    if (isCouponExist.usedBy.includes(req.user._id)) {
      return next(new ErrorClass(` this Coupon ${coupon} Used before`, 403));
    }
    req.body.coupon = isCouponExist;
  }

  const foundedId = [],
    existiesProduct = [],
    arrayForStock = [];
  let price = 0;
  for (const product of products) {
    const checkProduct = await productModel.findById(product.product);
    if (!checkProduct) {
      return next(new ErrorClass(`Product ${product.product} not found`, 404));
    }
    if (checkProduct.stock < product.quantity) {
      return next(
        new ErrorClass(`Product ${product.product} Out of Stock`, 404)
      );
    }
    existiesProduct.push({
      product: {
        name: checkProduct.name,
        price: checkProduct.price,
        paymentPrice: checkProduct.paymentPrice,
        productId: checkProduct._id,
      },
      quantity: product.quantity,
    });
    arrayForStock.push({ product: checkProduct, quantity: product.quantity });
    foundedId.push(checkProduct._id);
    price += checkProduct.paymentPrice * product.quantity;
  }

  for (const product of arrayForStock) {
    product.product.stock = product.product.stock - product.quantity;
    await product.product.save();
  }
  const paymentPrice= (price - (price * ((req.body.coupon?.amount || 0) / 100)));
  const order = await orderModel.create({
    userId: req.user._id,
    address,
    phone,
    note,
    paymentMethod,
    couponId: req.body.coupon?._id,
    status: paymentMethod == "card" ? "waitPayment" : "placed",
    products: existiesProduct,
    price,
    paymentPrice,
    // paymentPrice: price - price * ((req.body.coupon?.amount || 0) / 100),
  });
//pdf
const invoice = {
  shipping: {
    email: req.user.email,
    paymentPrice:paymentPrice,
    name: req.user.name,
    address,
  },
  items:existiesProduct.map((ele) => {
    return {
        item: ele.product.name,
        quantity: ele.quantity,
        amount: ele.product.paymentPrice
      
    };
  }),
  price,
};
const pdfpath = path.join(__dirname,"../../../utils/pdf/invioce.pdf");
createInvoice(invoice,pdfpath);
 await sendEmail({to:req.user.email, subject:"pdf",
 path:pdfpath, name:"order invoice",
 type:'application/pdf'
})

  if (paymentMethod == "card") {
    if (req.body.coupon) {
      const coupon = await stripe.coupons.create({percent_off: req.body.coupon.amount,duration: "once"});
      req.body.stripeCoupon = coupon.id;
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      metadata: {orderId: order._id.toString()},
      cancel_url: process.env.cancelURL,
      success_url: process.env.successlURL,
      discounts: req.body.stripeCoupon ? [ {coupon:req.body.stripeCoupon}  ]: [],

      line_items: existiesProduct.map((ele) => {
        return {
          price_data: {
            currency: "EGP",
            product_data: {
              name: ele.product.name,
            },
            unit_amount: ele.product.paymentPrice * 100,
          },
          quantity: ele.quantity,
        };
      }),
    });
    return res.status(201).json({ message: "Done", url: session.url });
  }

  //remove products from cart after payment
  if (req.body.products) {
    await cartModel.updateOne(
      { userId: req.user._id },
      {
        $pull: {
          products: {
            product: { $in: foundedId },
          },
        },
      }
    );
  } else {
    await cartModel.updateOne({ userId: req.user._id }, { products: [] });
  }

  if (req.body.coupon) {
    await couponModel.updateOne(
      { code: req.body.coupon.code },
      {
        $addToSet: {
          usedBy: req.user._id,
        },
      },
      { new: true }
    );
  }

  return res.status(201).json({ message: "Done", order });
};



export const webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const order = await orderModel.findByIdAndUpdate(event.data.object.metadata.orderId,{
          status:'placed'
        },{new:true})
        res.json({order: order})
        break;
      // ... handle other event types
      default:
        res.json({message:"in-vaild payment"})
        
    }

    res.send();
  }
