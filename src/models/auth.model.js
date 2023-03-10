import db from "../helpers/postgre.js";
import bcrypt from "bcrypt";

function comparePass(input, fromdb) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, email, phone_number FROM users WHERE email = $1`;
        db.query(sql, [req.body.email], () => {

        });
    });
}