const bcrypt = require("bcryptjs");

const UserModel = require("../models/userModel");

exports.getLogin = (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("auth/log-in", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
    csrfToken: req.csrfToken(),
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
      console.log(user);
      if (!user) {
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
                res.redirect("/login");
              }
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch(err => {
          err && res.redirect("/login");
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
    csrfToken: req.csrfToken(),
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
  return req.session.destroy(err => {
    res.redirect("/");
  });
};
