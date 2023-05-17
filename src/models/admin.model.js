import db from "../helpers/postgre.js";

const getMonthlyReport = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                    EXTRACT(YEAR FROM DATE_TRUNC('month', m.month_date)) AS year,
                    EXTRACT(MONTH FROM DATE_TRUNC('month', m.month_date)) AS month,
                    COALESCE(SUM(t.grand_total), 0) AS total_sum
                 FROM
                     (
                     SELECT 
                         generate_series(
                         DATE_TRUNC('month', NOW() AT TIME ZONE '+07:00') - INTERVAL '5 months',
                         DATE_TRUNC('month', NOW() AT TIME ZONE '+07:00'),
                         '1 month'
                         ) AS month_date
                     ) AS m
                 LEFT JOIN transactions t
                     ON DATE_TRUNC('month', t.transaction_time AT TIME ZONE '+07:00') = m.month_date
                 GROUP BY year, month
                 ORDER BY year, month`;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getDailyAverage = () => {
  return new Promise((resolve, reject) => {
    const sql = `WITH date_range AS (
                    SELECT generate_series(
                            CURRENT_DATE - INTERVAL '6 days',
                            CURRENT_DATE,
                            INTERVAL '1 day'
                        ) AS date
                )
                SELECT 
                    d.date, 
                    TRIM(to_char(d.date, 'Day')) AS day_name, 
                    COALESCE(ROUND(AVG(t.grand_total)::numeric), 0) AS average
                FROM 
                    date_range d
                LEFT JOIN 
                    transactions t 
                    ON 
                    DATE_TRUNC('day', t.transaction_time) = d.date
                GROUP BY 
                    d.date, 
                    day_name
                ORDER BY 
                    d.date`;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export default { getMonthlyReport, getDailyAverage };
