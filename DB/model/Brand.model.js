import { model, Schema, Types } from 'mongoose';


const brandSchema = new Schema({
    name: { type: String, required: true, unique: true,toLowerCase: true },
    slug: { type: String, required: true, unique: true,toLowerCase: true  },
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {

timestamps: true
})

const brandModel = model('Brand', brandSchema)

export default brandModel