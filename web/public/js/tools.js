const mysql = require('mysql2');
const db = require('./connect.js');

exports.query = (query, data = []) =>
    new Promise((resolve, reject) => {
        db.con.execute(mysql.format(query, data), async (err, results) => {
            if (err) {
                console.log(query, '\n//\n', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
