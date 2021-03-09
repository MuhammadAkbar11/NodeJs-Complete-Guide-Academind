const { checkSchema } = require("express-validator");

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
  },
});

module.exports = loginValidator;
