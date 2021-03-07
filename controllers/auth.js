const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const UserModel = require("../models/userModel");
const {
  sendMailVerification,
  sendMailResetPassword,
} = require("../util/sendMail");

exports.getLogin = (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }

  const flashdata = req.flash("flashdata");
  res.render("auth/log-in", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
    flashdata: flashdata,
  });
};

exports.postLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }

  const email = req.body.email;
  const password = req.body.password;

  UserModel.findOne({
    email: email,
  })
    .then(user => {
      if (!user) {
        req.flash("flashdata", {
          type: "error",
          message: "Invalid email",
        });
        return res.redirect("/login");
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
          req.flash("flashdata", {
            type: "error",
            message: "Wrong password",
          });
          res.redirect("/login");
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
  });
};

exports.postSignUp = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.password2;

  UserModel.findOne({
    email: email,
  })
    .then(userDoc => {
      if (userDoc) {
        req.flash("flashdata", {
          type: "error",
          message: "Email already exits, please take one",
        });
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12).then(hashedPw => {
        const user = new UserModel({
          name: name,
          email: email,
          password: hashedPw,
          authorization: false,
          role: "user",
          cart: { items: [] },
        });
        return user.save();
        // return true;
      });
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
  console.log(req.body, "post");
  const userId = req.body.userId.trim();
  const newPassword = req.body.password.trim();
  const confirmPassword = req.body.password2.trim();
  const passwordToken = req.body.passwordToken.trim();
  let resetUser;
  UserModel.findOne({
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
        (resetUser.resetToken = undefined),
          (resetUser.resetTokenExp = undefined);
        return resetUser.save();
      } else {
        req.flash("flashdata", {
          type: "error",
          message: "Failed to set your new password",
        });
        return res.redirect("/new-password");
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
      return res.redirect("/new-password");
    });
};

exports.logout = (req, res) => {
  return req.session.destroy(err => {
    res.redirect("/login");
  });
};
