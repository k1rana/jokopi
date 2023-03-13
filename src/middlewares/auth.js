import jwt from 'jsonwebtoken';

function check(req, res, next) {
  // take Auth.. from header
  const bearerToken = req.header("Authorization");
  if (!bearerToken)
    return res.status(403).json({
      msg: "Access denied! Not logged in",
    });
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err && err.name)
      return res.status(403).json({
        // err handling
        msg: err.message,
      });
    if (err)
      return res.status(500).json({
        msg: "Internal Server Error",
      });
    req.authInfo = payload;
    next();
  });
}

function admin(req, res, next) {
  if (req.authInfo.role <= 1)
    return res.status(403).json({
      msg: "Access denied!",
    });
  next();
}

export default { check, admin };
