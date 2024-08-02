module.exports = (req, res, next) => {
  if (!_.isEmpty(req.session.user)) {
    return res.redirect('/home');
  }else{
    return next();
  }
};
