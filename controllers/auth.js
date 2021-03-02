exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
  });
};

exports.postLogin = (req, res) => {
  // req.isLoggendIn = true;
  let reqEmail = "dubu@gmail.com";

  req.session.isLoggendIn = true;
  req.session.email = reqEmail;
  res.redirect("/");
};
