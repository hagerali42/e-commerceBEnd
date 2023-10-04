
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signup = {
    body: joi.object().required().keys({
        userName: generalFields.name.min(2).max(25).required(),
        email: generalFields.email.required(),
        password:generalFields.password.required(),
        cPassword:joi.string().valid(joi.ref("password")).required(),
        phone:joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)),
        gender:joi.string(),
        DOB: joi.date(),
        age:joi.number().min(10).max(100).integer().positive(),  
        role:joi.string(),
    }),
    file: generalFields.file, // image validation
    params:joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const login = {
    body: joi.object().required().keys({
        email: generalFields.email.required(),
        password:generalFields.password.required()
    }),
    params:joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}
export const forgetPassword = {
    body: joi.object().required().keys({
        email: generalFields.email.required()
    }),
    params:joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}
export const resetPassword = {
    body: joi.object().required().keys({
        email: generalFields.email.required(),
        code:joi.string().required(),
        password:generalFields.password.required(),
        cPassword:joi.string().valid(joi.ref("password")).required(),
    }),
    params:joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}