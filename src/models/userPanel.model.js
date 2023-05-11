import db from '../helpers/postgre.js';

function getUserProfile(userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT up.user_id, 
      up.display_name, 
      up.first_name, 
      up.last_name, 
      up.address, 
      up.birthdate, 
      up.img, 
      up.gender,
      up.created_at, 
      u.email, 
      u.phone_number FROM user_profile up JOIN users u ON up.user_id = u.id WHERE up.user_id = $1`;
    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export default { getUserProfile };
