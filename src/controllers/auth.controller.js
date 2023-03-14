import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../helpers/postgre.js';
import authModel from '../models/auth.model.js';
import tokenModel from '../models/token.model.js';

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
      role: userInfo.rows[0].role_id,
    };

    const expiresIn =
      rememberMe === "true" ? 7 * 24 * 60 * 60 * 1000 : 10 * 1000; // 7 hari : 10 menit
    const jwtOptions = { expiresIn };

    jwt.sign(payload, process.env.JWT_SECRET_KEY, jwtOptions, (err, token) => {
      if (err) throw err;

      let currentDate = new Date();
      let expirationDate = new Date(currentDate.getTime() + expiresIn); // Menambahkan 7 hari ke tanggal saat ini

      tokenModel.store(
        {
          token: token,
          expired_at: expirationDate,
        },
        (err, result) => {
          if (err) throw err;
          console.log(result);
        }
      );

      res.status(200).json({
        msg: "Login successful!",
        data: { token },
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

async function logout(req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const removeToken = await tokenModel.destroy(token);
    if (!removeToken) {
      throw new Error("Token not valid");
    }
    res.status(200).json({
      msg: "Logout Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function updatePassword(req, res) {
  const { authInfo, body } = req;
  if (body.oldPassword == undefined || body.newPassword == undefined) {
    res.status(400).json({ msg: "Field tidak boleh kosong!" });
    return;
  }
  try {
    const userData = await authModel.getUserInfo(authInfo.email);
    const passFromDb = userData.rows[0].password;
    const isPasswordValid = await bcrypt.compare(body.oldPassword, passFromDb);
    if (!isPasswordValid)
      return res.status(403).json({
        msg: "Password lama salah!",
      });
    const hashedPassword = await bcrypt.hash(body.newPassword, 15);
    await authModel.editPassword(authInfo.id, hashedPassword);
    res.status(200).json({
      msg: "Edit Password Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function requestResetPass(req, res) {
  try {
    const userData = await authModel.getUserInfo(req.body.email);
    if (userData.rows.length < 1)
      return res.status(409).json({ msg: "Email not registered" });
    const isAlreadyReq = await authModel.checkUserResetPass(
      userData.rows[0].id
    );
    const now = new Date();
    if (isAlreadyReq.rows.length > 0 && isAlreadyReq.rows[0].expired_at > now) {
      return res.status(400).json({
        msg: "Kamu telah generate link reset password, tunggu 10 menit",
      });
    }
    const result = await authModel.requestResetPass(userData.rows[0].id);
    console.log(
      `/resetPass/?verify=${result.rows[0].verify}&code=${result.rows[0].code}`
    );
    res.status(201).json({
      msg: "Link reset password created! Berlaku 10 menit",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const result = await authModel.checkReqResetPass(req.query.verify);
    if (result.rows.length < 1) {
      res.status(400).json({
        msg: "Verify not found",
      });
      return;
    }
    if (result.rows[0].code !== req.query.code) {
      res.status(404).json({
        msg: "Verify not found",
      });
      return;
    }
    const now = new Date();
    if (result.rows[0].expired_at < now) {
      return res.status(400).json({
        msg: "The link has expired",
      });
    }
    if (req.body.newPassword == undefined || req.body.newPassword.length < 8) {
      res.status(400).json({
        msg: "Password baru harus minimal 8 karakter",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 15);
    const resetPass = await authModel.editPassword(
      result.rows[0].user_id,
      hashedPassword
    );
    await authModel.deleteReqResetPass(result.rows[0].user_id);
    res.status(200).json({
      data: resetPass.rows,
      msg: "Password reseted succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

export default {
  login,
  register,
  logout,
  updatePassword,
  requestResetPass,
  resetPassword,
};
