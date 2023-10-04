import { Router } from "express";
import * as subcategoryController from './controller/subcategory.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from './subcategory.validation.js'
import { asyncHandler } from './../../utils/errorHandling.js';
import { auth, roles } from "../../middleware/auth.js";
const router = Router({mergeParams: true})

router.route('/')
.get( 
    validation(Val.getSubCategoryVal),
    asyncHandler (subcategoryController.getAllSubcategories)
)
.post(
  auth([roles.admin]),
  fileUpload(fileValidation.image).single('image'),
  validation(Val.addSubCategoryVal),
  asyncHandler(subcategoryController.addSubCategory)
)

router.route('/:subcategoryId')
.put(
  auth([roles.admin]),
  fileUpload(fileValidation.image).single('image'),
  validation(Val.updatesubCategoryVal),
 asyncHandler(subcategoryController.updatesubCategory)
)
.delete(
  auth([roles.admin]),
  validation(Val.deletesubCategoryVal),
 asyncHandler( subcategoryController.deletesubCategory)
)
.get(
validation(Val.getSubCategoryByIdVal),
asyncHandler(subcategoryController.getSubcategoryById)
)




export default router