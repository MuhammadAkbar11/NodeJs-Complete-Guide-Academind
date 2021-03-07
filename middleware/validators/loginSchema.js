const { checkSchema } = require("express-validator");
const UserModel = require("../../models/userModel");

const loginValidator = checkSchema({
  email: {
    notEmpty: {
      errorMessage: "Enter youe email address",
    },
    isEmail: {
      errorMessage: "Invalid email",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "enter your password",
    },
    isLength: {
      errorMessage: "Password should be at least 5 chars long",
      options: {
        min: 5,
      },
    },
  },
});

module.exports = loginValidator;
