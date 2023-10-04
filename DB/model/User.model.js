
import { Schema, Types, model } from "mongoose";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    gender:{
    type: String,
    default: 'male',
    enum: ['male', 'female'],
    },
    address:String,
    image: {type:Object},
    DOB: Date,
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    code:{
        type:String
    },
    favourites:[{
        type:Types.ObjectId,
        ref:'Product'
    }],
}, {
    timestamps: true
})


const userModel = model('User', userSchema)
export default userModel