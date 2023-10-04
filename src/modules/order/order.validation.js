import joi from 'joi'

export const addOrderVal = {
    body: joi.object().required().keys({
        products:joi.array(),
        address:joi.string().required(),
        phone:joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)).required(),
        note:joi.string(),
        coupon :joi.string(),
        paymentMethod:joi.string(),
    }),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}