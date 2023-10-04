import { Router } from "express";
import * as categoryController from "./controller/category.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./category.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import subcategoryRouter from '../subcategory/subcategory.router.js'
import { auth, roles } from "../../middleware/auth.js";
const router = Router()

router.use('/:categoryId/subCategory',subcategoryRouter)



router.route('/')
.post(
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.addCategoryVal),
    asyncHandler(categoryController.addCategory)
)
.get(
    validation(Val.getallCategoryVal),
    categoryController.getAllcategories
)


router.route('/:categoryId')
.put(
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.updateCategoryVal),
    asyncHandler(categoryController.updateCategory)
)
.delete(
    auth([roles.admin]),
    validation(Val.deleteCategoryVal),
    asyncHandler(categoryController.deleteCategory)
)
.get(
    validation(Val.getCategoryByIdVal),
    asyncHandler(categoryController.getcategoriesById)
)



export default router