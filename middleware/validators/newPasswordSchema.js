const { checkSchema } = require("express-validator");

const newPasswordValidator = checkSchema({
  password: {
    notEmpty: {
      errorMessage: "Enter your password",
    },
    isLength: {
      errorMessage: "Password should be at least 5 chars long",
      options: {
        min: 5,
      },
    },
  },
  password2: {
    notEmpty: {
      errorMessage: "Repeat your password",
    },
  },
});

module.exports = newPasswordValidator;
