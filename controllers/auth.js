const UserModel = require("../models/userModel");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
  });
};

exports.postLogin = (req, res) => {
  // req.isLoggendIn = true;
  const reqEmail = "dubu@gmail.com";

  UserModel.find({
    email: reqEmail.trim(),
  })
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user[0];
      res.redirect("/");
    })
    .catch(err => console.log(err));
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
};
