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

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await UserModel.findOne({ email: email });
    console.log(user);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    const domatch = await bcrypt.compare(password, user.password);

    if (!domatch) {
      const error = new Error("Password wrong!");
      error.statusCode = 401;
      throw error;
    }

    return res.status(200).json({
      status: "success",
      message: "Login success",
      user: user,
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
