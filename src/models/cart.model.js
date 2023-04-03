import db from '../helpers/postgre.js';

function getCartByUser(userId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM carts WHERE user_id = $1";
    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export default { getCartByUser };
