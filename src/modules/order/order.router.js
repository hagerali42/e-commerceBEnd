import express, { Router } from "express";
import * as orderController from './controller/order.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth, roles } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./order.validation.js";

const router = Router()

router.route('/')
.post(
    auth(Object.values(roles)),
   validation(Val.addOrderVal),
   asyncHandler( orderController.createOrder)
)

router.post('/webhook',
express.raw({type: 'application/json'}),
asyncHandler(orderController.webhook)
);




export default router