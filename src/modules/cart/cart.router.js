import { Router } from "express";

import * as cartController from './controller/cart.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import * as Val from './cart.validation.js'
import { validation } from "../../middleware/validation.js";
import { auth ,roles } from "../../middleware/auth.js";
const router = Router()

router.route('/')

.get(
    auth(Object.values(roles)),
  validation(Val.addToCartval),
  asyncHandler(cartController.getCartuser)
)

.post(
    auth(Object.values(roles)),
    validation(Val.getCartuserVal),
 asyncHandler( cartController.addToCart)
)






export default router