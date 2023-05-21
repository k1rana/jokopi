import db from '../helpers/postgre.js';

const getAdminTokenFcm = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ft.token
                  FROM fcm_tokens ft
                  JOIN users u ON ft.user_id = u.id
                    WHERE 
                    u.role_id = 2
                        AND
                    ft.expired_time > now()`;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getTokenFcmByUserId = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ft.token
                    FROM fcm_tokens ft
                    JOIN users u ON ft.user_id = u.id
                      WHERE 
                      u.id = ANY($1)
                          AND
                      ft.expired_time > now()`;
    db.query(sql, [user_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export default {
  getAdminTokenFcm,
  getTokenFcmByUserId,
};
