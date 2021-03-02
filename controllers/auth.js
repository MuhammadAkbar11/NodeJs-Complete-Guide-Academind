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
        return res.redirect("/signup");
      }
      const user = new UserModel({
        name: name,
        email: email,
        password: password,
        cart: { items: [] },
      });

      return user.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
      if (err) {
        console.log(err);
        res.redirect("/signup");
      }
    });
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
};
