import bcrypt from 'bcrypt';

import db from '../helpers/postgre.js';

function index(req) {
  return new Promise((resolve, reject) => {
    const sort = req.query.sort == "desc" ? "DESC" : "ASC"; // sort with query ?sort=
    let sortColumn;
    switch (req.query.orderBy || null) {
      default:
        sortColumn = "id";
        break;
    }
    const limit = `LIMIT ${!isNaN(req.query.limit) ? req.query.limit : 10}`;
    const sql = `SELECT 
    u.id, 
    u.email, 
    u.phone_number,
    p.display_name,
    p.first_name,
    p.last_name,
    p.address,
    p.birthdate,
    p.img AS img_url FROM users u 
    LEFT JOIN user_profile p ON p.user_id = u.id
    ORDER BY ${sortColumn} ${sort}
    ${limit}`;

    db.query(sql, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function getMeta(req) {
  return new Promise((resolve, reject) => {
    const q = req.query;
    const sql = `SELECT COUNT(*) AS totaldata FROM users`;

    db.query(sql, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      const totalData = parseInt(result.rows[0].totaldata);
      const page = !isNaN(q.page) ? parseInt(q.page) : 1;
      const limit = !isNaN(req.query.limit) ? parseInt(req.query.limit) : 10;
      const totalPage = Math.ceil(totalData / limit);
      let add = "";
      if (req.query.limit != undefined) add += `&limit=${limit}`;
      if (req.query.orderBy != undefined)
        add += `&orderBy=${req.query.orderBy}`;
      if (req.query.sort != undefined) add += `&sort=${req.query.sort}`;
      let next = `/users?page=${parseInt(page) + 1}`; // next
      let prev = `/users?page=${parseInt(page) - 1}`; // prev

      next += add;
      prev += add;
      if (page <= 1) prev = null;
      if (page >= totalPage) next = null;

      const meta = {
        totalData,
        prev,
        next,
        totalPage,
      };

      resolve(meta);
    });
  });
}

//
const storeUser = (client, req) => {
  return new Promise(async (resolve, reject) => {
    const sql = `INSERT INTO users (email, password, phone_number, role_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, role_id`;

    const data = req.body;
    const hashedPassword = await bcrypt.hash(data.password, 15);
    const values = [
      data.email,
      hashedPassword,
      data.phone_number,
      data.role || 1,
    ];
    client.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const storeProfile = (client, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO user_profile (user_id) 
        VALUES ($1)
        RETURNING user_id`;
    client.query(sql, [userId], (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

function show(req) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    u.id, 
    u.email, 
    u.phone_number,
    p.display_name,
    p.first_name,
    p.last_name,
    p.address,
    p.birthdate,
    p.img AS img_url FROM users u 
    LEFT JOIN user_profile p ON p.user_id = u.id
    WHERE u.id = $1`;
    const values = [req.params.userId];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function updateProfile(req) {
  return new Promise((resolve, reject) => {
    const {
      display_name,
      first_name,
      last_name,
      phone_number,
      address,
      birthdate,
    } = req.body;
    const { userId } = req.params;
    const sql = `
    UPDATE user_profile SET 
    display_name = $1,
    first_name = $2, 
    last_name = $3,  
    address = $5, 
    birthdate = $6
    WHERE id = $7 RETURNING *`;
    const values = [
      display_name,
      first_name,
      last_name,
      phone_number,
      address,
      birthdate,
      userId,
    ];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function destroyUser(client, userId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM users WHERE id = $1 RETURNING *`;
    client.query(sql, [userId], (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function destroyProfile(client, userId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM users WHERE id = $1 RETURNING *`;
    client.query(sql, [userId], (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

export default {
  index,
  show,
  storeUser,
  storeProfile,
  updateProfile,
  destroyProfile,
  destroyUser,
  getMeta,
};
