const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/multer");
const { categoryValidationSchema, validateCategory } = require("../middlewares/category");
const { createCategory, getAllCategories, getCategoriesForAdmin, updateCategoryTitle } = require("../controllers/category");


router.post( "/", authenticateUser, uploadImage, categoryValidationSchema, validateCategory, createCategory);

router.get( "/admin", authenticateUser, getCategoriesForAdmin);

router.get( "/", getAllCategories);

router.patch( "/:id", authenticateUser, categoryValidationSchema, validateCategory, updateCategoryTitle);

module.exports = router;
