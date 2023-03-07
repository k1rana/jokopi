import pg from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

const { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASS } = process.env;
// config connect db postgresql
const db = new pg.Pool({
  host: DB_HOST,
  database: DB_NAME,
  port: DB_PORT || 5432,
  user: DB_USER,
  password: DB_PASS,
});
db.connect((err) => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected to database');
  }
});

export default db;
