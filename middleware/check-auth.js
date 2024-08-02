const jwt = require('jsonwebtoken-refresh'),
  variables = require('../includes/variables');

module.exports = (req, res, next) => {
  try {
    let decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_TOKEN_KEY);
    var originalDecoded = jwt.decode(req.headers.authorization, { complete: true });
    var refreshed = jwt.refresh(originalDecoded, 3600, process.env.JWT_SECRET_TOKEN_KEY);

    req.refreshedToken = refreshed;
    next();
  } catch (error) {
    return res.status(401).json({
      "status": 401,
      "message": variables.unAuthorizedAccessMsg
    });
  }
};