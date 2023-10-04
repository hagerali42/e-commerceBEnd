import { Router } from "express";
import { addReview, updateReview } from "./controller/review.js";
import { auth, roles } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./reviews.validation.js"
const router = Router()

router.route('/')
.post(
    auth([roles.user]),
    validation(Val.addReview),
   asyncHandler(addReview)
)

router.route('/:id')
.put(
    auth([roles.user]),
    validation(Val.updateReviewVal),
   asyncHandler(updateReview)
)
.delete(
    auth([roles.user]),
    validation(Val.deleteReviewVal),
    asyncHandler(updateReview)
)

router.get('/', (req ,res)=>{
    res.status(200).json({message:"reviews Module"})
})




export default router