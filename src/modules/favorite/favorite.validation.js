import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addToFavVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        productId: generalFields.id
    }),
    query: joi.object().required().keys({})
}



export const getFavorite = {
    body: joi.object().keys({}),
    params: joi.object().keys({}),
    query: joi.object().required().keys({})

}