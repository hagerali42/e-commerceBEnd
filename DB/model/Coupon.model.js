import { model, Schema, Types } from 'mongoose';


const couponSchema = new Schema({
    code: { type: String, required: true,toLowerCase: true  },
    amount: { type: Number, default:0 ,min:0,max:100, required: true},
    expireDate:{ type: Date ,min:Date.now()},
    usedBy:[{type: Types.ObjectId, ref: 'User'}],
    numOfuses:{Number},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
})

const couponModel = model('Coupon', couponSchema)

export default couponModel