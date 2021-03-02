const UserModel = require("../models/userModel");

exports.getLogin = (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("auth/log-in", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
  });
};

exports.postLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }

  const reqEmail = "dubu@gmail.com";

  UserModel.find({
    email: reqEmail.trim(),
  })
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user[0];
      req.session.save(err => {
        if (err) {
          return res.redirect("/login");
        }

        return res.redirect("/login");
      });
    })
    .catch(err => console.log(err));
};

exports.getSignUp = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("auth/sign-up", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
  });
};

exports.postSignUp = (req, res) => {};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
};
