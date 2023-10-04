import { Router } from "express";
import * as brandController from './controller/brand.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from './brand.validation.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth, roles } from "../../middleware/auth.js";
const router = Router()


router.route('/')
.post(
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.addBrandVal),
    asyncHandler(brandController.addBrand)
)

.get(
    validation(Val.getallBrandVal),
    asyncHandler(brandController.getAllBrand)
)



router.route('/:brandId')
.put(
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.updateBrandVal),
    asyncHandler(brandController.updateCategory)
)
.delete(
    auth([roles.admin]),
    validation(Val.deleteBrandVal),
    asyncHandler(brandController.deleteCategory)
)
.get(
validation(Val.getBrandByIdVal),
asyncHandler(brandController.getBrandById)
)





export default router