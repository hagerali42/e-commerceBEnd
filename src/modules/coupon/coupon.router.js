import { Router } from "express";
import * as couponController from "./controller/coupon.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./coupon.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth, roles } from "../../middleware/auth.js";
const router = Router()

router.route('/')
.post(
    auth([roles.admin]),
    validation(Val.addcouponVal),
  asyncHandler(couponController.addCoupon)
)
.get(
  auth([ roles.user]),
validation(Val.getallcouponVal),
asyncHandler(couponController.getAllcoupons)
)

router.route('/:couponId')
.put(
    auth([roles.admin]),
    validation(Val.updatecouponVal),
    asyncHandler(couponController.updateCoupon)
)
.delete(
    auth([roles.admin]),
    validation(Val.deletecouponVal),
    asyncHandler(couponController.deleteCoupon)
)
.get(
auth([ roles.user]),
validation(Val.getcouponByIdVal),
asyncHandler(couponController.getcouponsById)
)


export default router