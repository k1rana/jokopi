import { Pool } from "pg";

// config connect db postgresql
const db = new Pool({
  host: "localhost",
  database: "jokopi",
  port: 5433,
  user: "postgres",
  password: "123456",
});

export default db;