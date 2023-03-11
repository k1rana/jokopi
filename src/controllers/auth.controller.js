import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../helpers/postgre.js";
import authModel from "../models/auth.model.js";

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
  const client = await db.connect();
  const { email, password, phone_number } = req.body;
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const regexPhone =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g;

  if (email == undefined || !email.match(regexEmail))
    return res.status(422).json({ msg: "Invalid email input" });
  if (password == undefined || parseInt(password.length) < 7)
    return res
      .status(422)
      .json({ msg: "Password must be atleast have 7 characters" });
  if (phone_number == undefined || !phone_number.match(regexPhone))
    return res.status(422).json({ msg: "Invalid phone numbers" });

  try {
    // check if email registered
    const checkEmail = await authModel.checkEmail(email);
    if (checkEmail.rows[0].count > 0)
      return res.status(409).json({ msg: "Email already registered" });

    // check if phone number registered
    const checkPhoneNumber = await authModel.checkPhoneNumber(phone_number);
    if (checkPhoneNumber.rows[0].count > 0)
      return res.status(409).json({ msg: "Phone number already registered" });

    await client.query("BEGIN");
    const userInfo = await authModel.createUser(client, req.body);
    const userProfile = await authModel.createProfile(
      client,
      userInfo.rows[0].id
    );
    const userSelect = await authModel.selectUser(
      client,
      userProfile.rows[0].user_id
    );
    await client.query("COMMIT");

    res.status(201).json({
      data: userSelect.rows,
      msg: "User has been successfully registered!",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  } finally {
    client.release();
  }
}

export default { login, register };
