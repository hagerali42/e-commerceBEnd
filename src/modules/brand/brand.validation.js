import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addBrandVal = {
    body: joi.object().required().keys({
        name: generalFields.name.required(),
    }),
    file: generalFields.file.required(), // image validation
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const updateBrandVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        brandId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const deleteBrandVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        brandId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const getallBrandVal = {
    body: joi.object().keys({}),
    params: joi.object().required().keys({}),
}
export const getBrandByIdVal = {
    body: joi.object().keys({}),
    params: joi.object().required().keys({
        brandId: generalFields.id
    }),
    query: joi.object().required().keys({})
}