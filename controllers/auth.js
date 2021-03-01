exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login | phoenix.com",
    path: "/login",
  });
};
