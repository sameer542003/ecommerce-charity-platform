const { body, validationResult } = require("express-validator");
const userFieldValidations = [
  body("name")
    .notEmpty().withMessage("Name is required"),

 body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Provide a valid email"),

  body("mobile")
    .notEmpty().withMessage("Mobile number is required")
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/).withMessage("Enter valid mobile number"),
   
  body("password")
    .notEmpty().withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,12}$/)
    .withMessage("Password must be 6-12 characters with at least 1 uppercase, 1 number, and 1 special character"),
];

const userFieldValidationsLogin=[
     body("loginId")
    .notEmpty().withMessage("Email or mobile no is required"),
     body("password")
    .notEmpty().withMessage("Password is required")


]
function validateUserSchema(req, res, next) {
    let results = validationResult(req);
    if (!results.isEmpty()) {
        let errors = results.array(); 
        return res.status(400).json({  
            status: "Failed",
            message: errors[0].msg
        });
    } else {
        next();  
}
}


module.exports = { userFieldValidations,userFieldValidationsLogin,validateUserSchema }