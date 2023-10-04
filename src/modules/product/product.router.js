import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as productController from './controller/product.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as Val from './product.validation.js'
import { auth, roles } from "../../middleware/auth.js";
const router = Router()


router.route('/')

.get(
    asyncHandler(productController.getAllProductes)
)

.post(
    auth([roles.admin]),
    fileUpload(fileValidation.image).fields([
        {name:'image',maxCount:1},
        {name:'coverImages',maxCount:5},
    ]),
    validation(Val.addProductVal),
    asyncHandler(productController.addProduct)
)

.put(
    auth([roles.admin]),
    fileUpload(fileValidation.image).fields([
        {name:'image',maxCount:1},
        {name:'coverImages',maxCount:5},
    ]),
    validation(Val.updateProductVal),
    asyncHandler(productController.updateProduct)
)

router.route('/:productId')
.delete(
    auth([roles.admin]),
    validation(Val.deletProductVal),
    asyncHandler(productController.deletProduct)
)
export default router