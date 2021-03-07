const express = require("express");
const { check } = require("express-validator/check");

const authController = require("../controllers/auth");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/signup", authController.getSignUp);
router.post(
  "/signup",
  check("email", "Invalid Email").isEmail(),
  authController.postSignUp
);
router.post("/logout", authController.logout);
router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authController.postForgotPassword);
router.get("/forgot-password-success", authController.getForgotPasswordSuccess);
router.get("/new-password", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
router.get("/authorization", authController.authorization);
module.exports = router;
