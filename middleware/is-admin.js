module.exports = (req, res, next) => {
  if (req.session.user.role.trim() !== "admin") {
    return res.redirect("/");
  }
  next();
};
