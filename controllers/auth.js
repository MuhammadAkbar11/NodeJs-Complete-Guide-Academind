exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
  });
};

exports.postLogin = (req, res) => {
  // req.isLoggendIn = true;
  let reqEmail = "dubu@gmail.com";

  res.setHeader("Set-Cookie", [`email=${reqEmail}`, "isLoggendIn=true"]);
  res.redirect("/");
};
