const { checkSchema } = require("express-validator");
const UserModel = require("../../models/userModel");

const signUpValidator = checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Enter your name",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "Enter youe email address",
    },
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
  password2: {
    notEmpty: {
      errorMessage: "enter confirm password",
    },
    custom: {
      options: (value, { req, location, path }) => {
        if (value !== req.body.password) {
          throw new Error("Password have to match!");
        }
        return true;
      },
    },
  },
});

module.exports = signUpValidator;
