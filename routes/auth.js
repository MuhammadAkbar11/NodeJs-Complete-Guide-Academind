const express = require("express");
const { check, body, checkSchema } = require("express-validator");
const signUpValidator = require("../middleware/validators/singUpSchema");

const authController = require("../controllers/auth");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/signup", authController.getSignUp);
router.post("/signup", [signUpValidator], authController.postSignUp);
router.post("/logout", authController.logout);
router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authController.postForgotPassword);
router.get("/forgot-password-success", authController.getForgotPasswordSuccess);
router.get("/new-password", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
router.get("/authorization", authController.authorization);
module.exports = router;
