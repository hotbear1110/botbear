require('dotenv').config();
const mysql = require('mysql2');

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

con.on('error', (err) => {
  console.log(err);
  if (err.fatal) {
    con.destroy();
  }
  throw err;
});

module.exports = { con };
