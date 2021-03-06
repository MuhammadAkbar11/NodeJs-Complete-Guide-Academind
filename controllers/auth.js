const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const UserModel = require("../models/userModel");
const {
  sendMailVerification,
  sendMailResetPassword,
} = require("../util/sendMail");
const errMsgValidator = require("../util/errMsgValidator");

exports.getLogin = (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }

  const flashdata = req.flash("flashdata");
  res.render("auth/log-in", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
    flashdata: flashdata,
    inputsVal: {
      email: "",
      password: "",
    },
    errors: {},
  });
};

exports.postLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }

  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  const flashdata = req.flash("flashdata");
  const errMsg = errMsgValidator(errors.array());

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/log-in", {
      pageTitle: "login | phoenix.com",
      path: "/login",
      csrfToken: req.csrfToken(),
      flashdata: flashdata,
      inputsVal: req.body,
      errors: errMsg,
    });
  }

  // tempalate render error
  const renderIsError = (
    flashdataError = {
      type: "",
      message: "",
    }
  ) => {
    res.status(422).render("auth/log-in", {
      pageTitle: "login | phoenix.com",
      path: "/login",
      csrfToken: req.csrfToken(),
      flashdata: [flashdataError],
      inputsVal: req.body,
      errors: errMsg,
    });
  };

  UserModel.findOne({
    email: email,
  })
    .then(user => {
      console.log(user);
      if (!user) {
        return renderIsError({ type: "error", message: "Email not found" });
      }

      return bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              if (err) {
                req.flash("flashdata", {
                  type: "error",
                  message: "Failed to login",
                });
                res.redirect("/login");
              }
              res.redirect("/");
            });
          }
          return renderIsError({ type: "error", message: "wrong password" });
        })
        .catch(err => {
          req.flash("flashdata", {
            type: "error",
            message: "Failed to login",
          });
          err && res.redirect("/login");
        });
    })
    .catch(err => console.log(err));
};

exports.getSignUp = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  const flashdata = req.flash("flashdata");
  res.render("auth/sign-up", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
    csrfToken: req.csrfToken(),
    flashdata: flashdata,
    inputsVal: {
      name: "",
      email: "",
      password: "",
      password2: "",
    },
    errors: {},
  });
};

exports.postSignUp = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.password2;

  const errors = validationResult(req);

  const flashdata = req.flash("flashdata");

  const errMsg = errMsgValidator(errors.array());

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/sign-up", {
      pageTitle: "Sing-up | phoenix.com",
      path: "/sing-up",
      csrfToken: req.csrfToken(),
      flashdata: flashdata,
      inputsVal: req.body,
      errors: errMsg,
    });
  }

  return bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new UserModel({
        name: name,
        email: email,
        password: hashedPw,
        authorization: false,
        role: "user",
        cart: { items: [] },
      });
      return user.save();
    })
    .then(result => {
      req.flash("flashdata", {
        type: "success",
        message: "Success create an account, please check your email",
      });
      res.redirect("/login");
      return sendMailVerification({
        fromName: "Phoenix Production",
        to: email,
        subject: "Verify your email!",
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    })
    .catch(err => {
      if (err) {
        req.flash("flashdata", {
          type: "error",
          message: "Failed to sing up",
        });
        res.redirect("/signup");
      }
    });
};

exports.authorization = (req, res) => {
  const email = req.query.email;
  UserModel.findOne({
    email: email,
  })
    .then(user => {
      return user.updateOne({
        $set: { authorization: true },
      });
    })
    .then(result => {
      let flashObj = {
        type: "info",
        message: "Email alredy to verify!",
      };
      if (result.nModified > 0) {
        flashObj = {
          type: "success",
          message: "Verification success!",
        };
      }
      req.flash("flashdata", flashObj);
      res.redirect("/login");
    });
};

exports.getForgotPassword = (req, res) => {
  const flashdata = req.flash("flashdata");
  res.render("auth/forgot-password", {
    pageTitle: "Forgot Password | phoenix.com",
    path: "/forgot-password",
    csrfToken: req.csrfToken(),
    flashdata: flashdata,
  });
};
exports.getForgotPasswordSuccess = (req, res) => {
  const flashdata = req.flash("flashdata");
  res.render("auth/forgot-password-success", {
    pageTitle: "Request successfull | phoenix.com",
    path: "/forgot-password-success",
    csrfToken: req.csrfToken(),
    flashdata: flashdata,
  });
};

exports.postForgotPassword = (req, res) => {
  const email = req.body.email;

  if (email.trim() === "") {
    req.flash("flashdata", {
      type: "error",
      message: "Please enter your email",
    });
    res.redirect("/forgot-password");
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);

      return res.redirect("/forgot-password");
    }

    const token = buffer.toString("hex");
    UserModel.findOne({
      email: email,
    })
      .then(user => {
        if (user === null) {
          req.flash("flashdata", {
            type: "error",
            message: "No account with that email found",
          });
          return res.redirect("/forgot-password");
        } else {
          user.resetToken = token;
          user.resetTokenExp = Date.now() + 3600000;

          return user.save();
        }
      })
      .then(result => {
        if (result) {
          res.redirect("/forgot-password-success");
          return sendMailResetPassword({
            fromName: "Phoenix Production",
            to: email,
            subject: "Password Reset",
            token: token,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.query.token;
  const flashdata = req.flash("flashdata");
  const errors = req.flash("errors")[0];
  UserModel.findOne({
    resetToken: token,
  })
    .then(user => {
      if (!user) {
        req.flash("flashdata", {
          type: "error",
          message: "Invalid token",
        });
        return res.redirect("/login");
      } else {
        if (user.resetTokenExp > Date.now()) {
          res.render("auth/new-password", {
            pageTitle: "New password | phoenix.com",
            path: "/new-password",
            csrfToken: req.csrfToken(),
            flashdata: flashdata,
            errors: errors,
            user: user,
          });
        } else {
          req.flash("flashdata", {
            type: "error",
            message: "token expaired",
          });
          return res.redirect("/login");
        }
      }
    })
    .catch(err => console.log(err));
};
exports.postNewPassword = (req, res) => {
  const userId = req.body.userId.trim();
  const newPassword = req.body.password.trim();
  const confirmPassword = req.body.password2.trim();
  const passwordToken = req.body.passwordToken.trim();
  let resetUser;

  const errors = validationResult(req);

  const errMsg = errMsgValidator(errors.array());

  if (!errors.isEmpty()) {
    req.flash("errors", {
      ...errMsg,
    });
    return res.redirect(`new-password?token=${passwordToken}`);
  } else {
    if (newPassword !== confirmPassword) {
      console.log("true");
      req.flash("flashdata", {
        type: "error",
        message: "Password do not match!",
      });
      return res.redirect(`new-password?token=${passwordToken}`);
    }

    return UserModel.findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExp: { $gt: Date.now() },
    })
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPw => {
        if (resetUser !== null) {
          resetUser.password = hashedPw;
          resetUser.resetToken = undefined;
          resetUser.resetTokenExp = undefined;
          return resetUser.save();
        } else {
          req.flash("flashdata", {
            type: "error",
            message: "Failed to set your new password",
          });
          return res.redirect(`new-password?token=${passwordToken}`);
        }
      })
      .then(result => {
        req.flash("flashdata", {
          type: "success",
          message: "Success to set new password",
        });
        return res.redirect("/login");
      })
      .catch(err => {
        req.flash("flashdata", {
          type: "error",
          message: "Sorry, something wrong",
        });
        return res.redirect(`new-password?token=${passwordToken}`);
      });
  }
};

exports.logout = (req, res) => {
  return req.session.destroy(err => {
    res.redirect("/login");
  });
};
