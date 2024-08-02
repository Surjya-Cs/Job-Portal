const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.session.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_TOKEN_KEY, (err, user) => {
      if (err) {
        return res.redirect("/");
      }
      req.user = user;
      if (!_.isEmpty(req.session.user)) {
        return next();
      } else {
        return res.redirect("/");
      }
    });
  } else {
    return res.redirect("/");
  }
};
