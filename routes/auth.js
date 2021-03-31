const express = require("express");
const authController = require("../controllers/auth");
const { signUpValidation } = require("../middleware/validators/auth");

const router = express.Router();

router.put("/signup", [signUpValidation], authController.postSignUp);

module.exports = router;
