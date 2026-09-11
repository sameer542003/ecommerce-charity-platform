const { body, validationResult } = require("express-validator");

const orderValidationSchema = [
  body("product_id")
    .notEmpty().withMessage("Product ID is required")
    .isMongoId().withMessage("Invalid product ID"),

  body("quantity")
    .notEmpty().withMessage("Quantity is required")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1")
];

function validateOrder(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      status: "Failed",
      message: result.array()[0].msg
    });
  }
  next();
}

module.exports = { orderValidationSchema, validateOrder };