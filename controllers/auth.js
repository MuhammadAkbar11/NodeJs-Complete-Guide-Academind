const { validationResult } = require("express-validator");
const errMessageValidation = require("../utils/errMessageValidation");

exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.password2;

  const errors = validationResult(req);
  const errorMsgs = errMessageValidation(errors.array());

  if (!errors.isEmpty()) {
    const error = new Error();
    error.message = "Validation failed , entered data is incorrect";
    error.statusCode = 422;
    error.validationMessage = errorMsgs;
    throw error;
  }
};
