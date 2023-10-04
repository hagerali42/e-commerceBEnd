import joi from 'joi'
import { Types } from 'mongoose'
const dataMethods = ["body", 'params', 'query', 'headers', 'file']

const validateObjectId = (value, helper) => {
    console.log({ value });
    console.log(helper);
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId')
}
export const generalFields = {

    email: joi.string().email({ minDomainSegments: 2,maxDomainSegments: 4,tlds: { allow: ['com', 'net'] }}).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/)).required(),
    cPassword: joi.string().required(),
    id: joi.string().custom(validateObjectId).required(),
    optionalId: joi.string().custom(validateObjectId),

    name: joi.string(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}

export const validation = (schema) => {
    return (req, res, next) => {
        // console.log({ body: req.body });
        const validationErr = []
        dataMethods.forEach(key => {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationErr.push(validationResult.error.details)
                }
            }
        });
        if (validationErr.length) {
            return res.status(400).json({ message: "Validation Err", validationErr })
        }
        return next()
    }
}

// export const validationn=(schema)=>{
//     return(req,res,next) =>{
//         const inputData={...req.body ,...req.query,...req.params}
//         if(req.file || req.files){
//             inputData.file = req.file || req.files;
//         }
//         const validationResult = schema.validate(inputData, { abortEarly: false })
//         if(validationResult.error?.details){
//             return res.status(400).json({ message: "Validation Err", validationErr:validationResult.error.details })
//         }
//         return next()
//     }
// }