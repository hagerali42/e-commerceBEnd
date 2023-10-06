import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addToCartval = {
    body: joi.object().required().keys({
        productId: generalFields.id,
        quantity:joi.number().required()
    }),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}


export const getCartuserVal = {
    body: joi.object().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}