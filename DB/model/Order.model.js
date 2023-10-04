import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { 
            name:{ type: String, required: true },
            price: { type: Number, required: true,},
            paymentPrice: { type: Number, required: false},
            //to see product in the current price
            productId: { type: Types.ObjectId,ref:'Product', required: true}
            },

        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    couponId: { type: Types.ObjectId, ref: "Coupon" },
    price: { type: Number, required: true },
    paymentPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "card"], default: "cash" },
    status: {
      type: String,
      enum: [
        "waitPayment",
        "canceled",
        "rejected",
        "rood",
        "delivered",
        "placed",
      ],
      default: "placed",
    },
    reason: String,

  },
  {
    timestamps: true,
  }
);

const orderModel = model("Order", orderSchema);

export default orderModel;
