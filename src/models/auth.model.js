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

// function getPass(input, fromdb) {
//   return new Promise((resolve, reject) => {
//     const sql = `SELECT password FROM users WHERE email = $1`;
//     db.query(sql, [req.body.email], () => {
//       if (condition) {
//       }
//     });
//   });
// }
export default { getUserInfo };
