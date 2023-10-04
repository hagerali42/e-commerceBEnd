import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const addcouponVal = {
    body: joi.object().required().keys({
        code: generalFields.name,
        amount:joi.number().positive().min(1).max(100).required(),
        expireDate:joi.date().greater(Date.now()),
        numOfuses:joi.number(),
    
    }),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const updatecouponVal = {
    body: joi.object().required().keys({
        code: generalFields.name,
        amount:joi.number().positive().min(1).max(100).required(),
        expireDate:joi.date().greater(Date.now()),
        numOfuses:joi.number(),
    }),
    params: joi.object().required().keys({
        couponId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const deletecouponVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        couponId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const searchcouponVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({
        searchKey: generalFields.name
    })
}
export const getallcouponVal = {
    body: joi.object().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}
export const getcouponByIdVal = {
    body: joi.object().keys({}),
    params: joi.object().required().keys({
        couponId: generalFields.id
    }),
    query: joi.object().required().keys({})
}