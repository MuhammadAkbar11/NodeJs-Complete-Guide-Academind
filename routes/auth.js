const express = require("express");
const authController = require("../controllers/auth");
const { signUpValidation } = require("../middleware/validators/auth");

const router = express.Router();

router.put("/signup", [signUpValidation], authController.postSignUp);

router.post("/login", authController.login);

module.exports = router;
