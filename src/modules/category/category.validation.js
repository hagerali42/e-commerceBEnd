import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name.required(),
    }),
    file: generalFields.file.required(), // image validation
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const updateCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        categoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const deleteCategoryVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        categoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}


export const getallCategoryVal = {
    body: joi.object().keys({}),
    file: generalFields.file, // image validation
    params: joi.object().keys({

    }),
    // query: joi.object().required().keys({})
}
export const getCategoryByIdVal = {
    body: joi.object().keys({}),
    file: generalFields.file, // image validation
    params: joi.object().required().keys({
        categoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}