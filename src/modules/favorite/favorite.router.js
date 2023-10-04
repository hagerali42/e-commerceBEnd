import { Router } from "express";

import { asyncHandler } from "../../utils/errorHandling.js";
import * as Val from './favorite.validation.js'
import { validation } from "../../middleware/validation.js";
import { auth ,roles } from "../../middleware/auth.js";
import * as favController from "./controller/favorite.js";
const router = Router()

router.route('/')
.get(
    auth([ roles.user]),
    validation(Val.getFavorite),
    asyncHandler(favController.getFavorite)
)


router.route('/:id')
.patch(
    auth([roles.user]),
    validation(Val.addToFavVal),

    asyncHandler(favController.addToFavorite)
)







export default router