import bcrypt from 'bcrypt';

import db from '../helpers/postgre.js';

function getUserInfo(email) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = $1";
    db.query(sql, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function checkEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) as count FROM users WHERE email = $1";
    db.query(sql, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function checkPhoneNumber(phoneNumber) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) as count FROM users WHERE phone_number = $1";
    db.query(sql, [phoneNumber], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function createUser(client, body) {
  return new Promise(async (resolve, reject) => {
    const { email, password, phone_number } = body;
    const encryptedPass = await bcrypt.hash(password, 15);
    const sql = `INSERT INTO users (email, password, phone_number) VALUES ($1, $2, $3) RETURNING id`;
    client.query(sql, [email, encryptedPass, phone_number], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function createProfile(client, userId) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO user_profile (user_id) VALUES ($1) RETURNING user_id`;
    client.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function selectUser(client, userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT u.id, u.email, u.phone_number, p.display_name, p.first_name, p.last_name, p.address, p.birthdate, p.created_at FROM users u JOIN user_profile p ON p.user_id = u.id WHERE u.id = $1`;
    client.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function editPassword(userid, newPassword) {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET password = $2 WHERE id = $1 RETURNING id";
    db.query(sql, [userid, newPassword], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export default {
  getUserInfo,
  createUser,
  createProfile,
  checkEmail,
  checkPhoneNumber,
  editPassword,
  selectUser,
};
