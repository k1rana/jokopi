import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import authModel from '../models/auth.model.js';

// login controller
async function login(req, res) {
  try {
    const { email, password, rememberMe } = req.body;
    const userInfo = await authModel.getUserInfo(email);

    if (userInfo.rows.length < 1)
      return res.status(401).json({
        msg: "Email atau password salah!",
      });
    const isPasswordValid = await bcrypt.compare(
      password,
      userInfo.rows[0].password
    );
    if (!isPasswordValid)
      return res.status(401).json({
        msg: "Email atau password salah!",
      });

    const payload = {
      id: userInfo.rows[0].id,
      email: userInfo.rows[0].email,
      phone_number: userInfo.rows[0].id.phone_number,
    };
    const expiresIn = rememberMe === "true" ? "7d" : "10m";
    const jwtOptions = { expiresIn };

    jwt.sign(payload, process.env.JWT_SECRET_KEY, jwtOptions, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        msg: "Login successful!",
        token,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

// register controller
async function register(req, res) {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

export default { login, register };
