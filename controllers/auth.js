const bcrypt = require("bcryptjs");

const UserModel = require("../models/userModel");
const sendMail = require("../util/sendMail");

exports.getLogin = (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }

  const flashdata = req.flash("flashdata");

  res.render("auth/log-in", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
    flashdata: flashdata[0],
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
    flashdata: flashdata[0],
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
          role: "user",
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then(result => {
      req.flash(
        "success",
        "Success create an account, please check your email"
      );
      res.redirect("/login");
      return sendMail({
        fromName: "phoenix",
        to: email,
        subject: "Verify your email!",
        html: `<h1>You Successfully signed up!</h1>`,
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

exports.logout = (req, res) => {
  return req.session.destroy(err => {
    res.redirect("/login");
  });
};
