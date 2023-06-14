module.exports = (req, res, next) => {
  if (!req.session.User) {
    return res.redirect("/login");
  }

  return next();
};
