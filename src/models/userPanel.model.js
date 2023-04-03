import db from "../helpers/postgre.js";

function getUserProfile(userId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user_profile WHERE user_id = $1";
    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export default { getUserProfile };
