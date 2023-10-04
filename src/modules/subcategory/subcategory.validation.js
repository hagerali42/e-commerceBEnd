import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addSubCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name.required(),
        categoryId: generalFields.id,
    }),
    file: generalFields.file.required(), // image validation
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const updatesubCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        subcategoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const deletesubCategoryVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        subcategoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}


export const getSubCategoryVal = {
    body: joi.object().keys({}),
     params: joi.object().keys({
     }),
 
}

export const getSubCategoryByIdVal = {
    body: joi.object().keys({}),
    params: joi.object().required().keys({
        subcategoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}



