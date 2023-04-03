import db from '../helpers/postgre.js';

function getCartByUser(userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT c.user_id, 
    c.product_id, 
    c.size_id,
    count,
    p.price,
    p.price * s.price as totalPrice FROM carts c 
    JOIN products p ON c.product_id = p.id 
    JOIN product_size ps ON c.size_id = ps.id 
    WHERE user_id = $1`;
    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function deleteCartById(cartId) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM carts WHERE id = $1";
    db.query(sql, [cartId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export default { getCartByUser, deleteCartById };
