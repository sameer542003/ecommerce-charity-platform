const express = require("express");
const router = express.Router();
const {register,login,getMe}=require("../controllers/user")
const { userFieldValidations,userFieldValidationsLogin,validateUserSchema}=require("../middlewares/user")
const { authenticateUser } = require("../middlewares/auth")

router.post("/register",userFieldValidations,validateUserSchema,register);
router.post("/login",userFieldValidationsLogin,validateUserSchema,login);
router.get("/me", authenticateUser, getMe);


module.exports=router;
