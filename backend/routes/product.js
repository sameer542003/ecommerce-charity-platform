const express = require("express");
const router = express.Router();
const { uploadImage } = require("../middlewares/multer"); 
const { authenticateUser } = require("../middlewares/auth");
const { productFieldValidations, validateProductSchema } = require("../middlewares/product");
const { 
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByCharityForAdmin,
    getProductsByCharityPublic,
    getProductsByCategory,
    updateProductStatus,
    updateProduct
} = require("../controllers/product");

router.post("/", authenticateUser, uploadImage, productFieldValidations, validateProductSchema, createProduct);

router.put("/:id", authenticateUser, uploadImage, updateProduct);

router.patch("/:id/status", authenticateUser, updateProductStatus);

router.get("/admin/charity/:id", authenticateUser,getProductsByCharityForAdmin);

router.get("/charity/:id", getProductsByCharityPublic);

router.get("/category/:id", getProductsByCategory);

router.get("/", getAllProducts);

router.get("/:id", getProductById);

module.exports = router;