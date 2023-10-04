import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, toLowerCase: true },
    slug: { type: String, required: true, unique: true, toLowerCase: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 1 }, //quantity i have 
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: false, default: 0 },
    paymentPrice: { type: Number, required: false, default: 0 },
    colors:{ type:Array },
    sizes:{ type:Array},
    coverImages:{ type:Array},
    image: { type: Object ,required:true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    subcategoryId: { type: Types.ObjectId, ref: "SubCategory", required: true },
    brandId: { type: Types.ObjectId, ref: "Brand", required: true },
    avgRate:{ type:Number , default:0},
    rateNo:{ type:Number, default:0},
    sold:{ type:Number, default:0},
    QRcode:{type:String, required:true,},
    createdBy:{ type:Types.ObjectId, ref:'User',required:true},
    wishlist:[{ type:Types.ObjectId ,ref:'User'}],
  },
  {
    timestamps: true,
  }
);

const productModel = model("Product", productSchema);

export default productModel;
