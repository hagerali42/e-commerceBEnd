import joi from 'joi'
import { generalFields } from './../../middleware/validation.js';


export const addProductVal = {
    body: joi.object().required().keys({
        name: generalFields.name.required(),
        description:generalFields.name.min(20).required(),
        price:joi.number().required().min(0).positive().required(),
        discount:joi.number().min(0).max(100).positive(),
        quantity:joi.number().min(0).positive(),
        colors:joi.custom(( value,helper)=>{
            value=JSON.parse(value);
            const valueScheme = joi.object({value:joi.array().items(joi.string().alphanum())})
            const validationResult =valueScheme.validate({value})
            if(validationResult.error){
               return helper.message(validationResult.error.details)
            }else{return true}
 
         }),
        sizes:joi.custom(( value,helper)=>{
           value=JSON.parse(value);
           const valueScheme = joi.object({value:joi.array().items(joi.string().alphanum())})
           const validationResult =valueScheme.validate({value})
           if(validationResult.error){
              return helper.message(validationResult.error.details)
           }else{return true}

        }),
        categoryId:generalFields.id,
        subcategoryId:generalFields.id,
        brandId:generalFields.id,
    }),
    files: joi.object().required().keys({
        image:joi.array().items(generalFields.file).length(1).required(),
        coverImages:joi.array().items(generalFields.file).max(5),
    }), 
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const getAllProductVal = {
    body: joi.object().required().keys({}), 
    params: joi.object().required().keys({}),
   
}

export const updateProductVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
        description:generalFields.name.min(20),
        price:joi.number().required().min(0).positive(),
        discount:joi.number().min(0).max(100).positive(),
        quantity:joi.number().min(0).positive(),
        colors:joi.custom(( value,helper)=>{
            value=JSON.parse(value);
            const valueScheme = joi.object({value:joi.array().items(joi.string().alphanum())})
            const validationResult =valueScheme.validate({value})
            if(validationResult.error){
               return helper.message(validationResult.error.details)
            }else{return true}
 
         }),
        sizes:joi.custom(( value,helper)=>{
           value=JSON.parse(value);
           const valueScheme = joi.object({value:joi.array().items(joi.string().alphanum())})
           const validationResult =valueScheme.validate({value})
           if(validationResult.error){
              return helper.message(validationResult.error.details)
           }else{return true}

        }),
        categoryId:generalFields.optionalId,
        subcategoryId:generalFields.optionalId,
        brandId:generalFields.optionalId,
        productId:generalFields.id,
    }),
    files: joi.object().required().keys({
        image:joi.array().items(generalFields.file).max(1),
        coverImages:joi.array().items(generalFields.file).max(5),
    }), 
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}
export const deletProductVal = {
    body: joi.object().required().keys({
    }), 
    params: joi.object().required().keys({
        productId:generalFields.id,
    }),
    query: joi.object().required().keys({})
}