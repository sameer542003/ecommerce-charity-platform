const { body, validationResult } = require("express-validator");

const productFieldValidations = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .matches(/^[A-Za-z\s]+$/).withMessage("Title must contain only alphabets"),

  body("short_description")
    .notEmpty().withMessage("Short description is required")
    .isLength({ min: 10, max: 100 }).withMessage("Short description must be between 10 and 100 characters"),

  body("long_description")
    .notEmpty().withMessage("Long description is required")
    .isLength({ min: 20, max: 1000 }).withMessage("Long description must be between 20 and 1000 characters"),

  body("charity_id")
    .notEmpty().withMessage("Charity ID is required")
    .isMongoId().withMessage("Invalid charity ID"),

  body("category_id")
    .notEmpty().withMessage("Category ID is required")
    .isMongoId().withMessage("Invalid category ID"),

  body("quantity")
    .notEmpty().withMessage("Quantity is required")
    .isInt({ min: 25, max: 50 }).withMessage("Quantity must be between 25 and 50"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isNumeric().withMessage("Price must be a number"),

  body("discount")
    .optional()
    .isNumeric().withMessage("Discount must be a number"),

  body("status")
    .optional()
    .isIn(["pending", "active", "sold", "inactive"])
    .withMessage("Invalid status value")
];

const validateProductSchema = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      status: "Failed",
      message: result.array()[0].msg,
    });
  }
  next();
};

module.exports = { productFieldValidations, validateProductSchema };
