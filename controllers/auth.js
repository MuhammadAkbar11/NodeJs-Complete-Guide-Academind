const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const UserModel = require("../models/userModel");
const errMessageValidation = require("../utils/errMessageValidation");

exports.postSignUp = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  const errorMsgs = errMessageValidation(errors.array());

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect");
      error.statusCode = 422;
      error.data = {
        validationMessage: errorMsgs,
      };
      throw error;
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const user = new UserModel({
      email: email,
      name: name,
      password: hashedPw,
    });

    const result = await user.save();

    return res.status(200).json({
      status: "success",
      message: "success create account",
      user: result,
      request: { name, email, password },
    });
  } catch (error) {
    console.log(error, "error auth");
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "Something went wrong";
    }
    next(error);
  }
};
