const { checkSchema } = require("express-validator");
const UserModel = require("../../models/userModel");

exports.signUpValidation = checkSchema({
  name: {
    trim: true,
  },
  email: {
    trim: true,
    normalizeEmail: true,
    isEmail: {
      errorMessage: "Invalid email",
    },
    custom: {
      options: (value, { req }) => {
        return UserModel.findOne({
          email: value,
        }).then(user => {
          if (user) {
            return Promise.reject("Email already exits");
          }
          return true;
        });
      },
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
