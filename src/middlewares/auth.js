import jwt from 'jsonwebtoken';

import tokenModel from '../models/token.model.js';

async function check(req, res, next) {
  // take Auth.. from header
  const bearerToken = req.header("Authorization");
  if (!bearerToken)
    return res.status(403).json({
      status: 403,
      msg: "Access denied! Not logged in",
    });
  const token = bearerToken.split(" ")[1];

  const tokenVerify = await tokenModel.get(token);
  // console.log(bearerToken);
  if (!tokenVerify) {
    return res.status(403).json({
      status: 403,
      msg: "JWT Rejected",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err && err.name)
      return res.status(403).json({
        // err handling
        status: 403,
        msg: err.message,
      });
    if (err)
      return res.status(500).json({
        status: 500,
        msg: "Internal Server Error",
      });
    req.authInfo = payload;
    next();
  });
}

function admin(req, res, next) {
  if (req.authInfo.role <= 1)
    return res.status(403).json({
      status: 403,
      msg: "Access denied!",
    });
  next();
}

export default { check, admin };
