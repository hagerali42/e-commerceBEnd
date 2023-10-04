import { model, Schema, Types } from 'mongoose';


const categorySchema = new Schema({
    name: { type: String, required: true, unique: true,toLowerCase: true  },
    slug: { type: String, required: true, unique: true,toLowerCase: true  },
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps: true
})
categorySchema.virtual('subcategories',{
    localField:'_id',
    foreignField:'categoryId',
    ref:'SubCategory'
})
const categoryModel = model('Category', categorySchema)

export default categoryModel