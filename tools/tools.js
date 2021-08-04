const mysql = require("mysql2");
const got = require("got");
const db = require('../connect/connect.js');
const tools = require("./tools.js");


exports.query = (query, data = []) =>
    new Promise((resolve, reject) => {
        db.con.execute(mysql.format(query, data), async (err, results) => {
            if (err) {
                console.log(query, "\n//\n", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });

exports.banphrasePass = (message, channel) => new Promise(async (resolve, reject) => {
        this.channel = channel.replace("#", '')
        this.data = await tools.query(`
          SELECT banphraseapi
          FROM Streamers
          WHERE username=?`,
              [this.channel]);
          console.log(this.data[0].banphraseapi)
          if (this.data[0].banphraseapi === null) {
              resolve(0);
              return;
          }
        this.checkBanphrase = await got(this.data[0].banphraseapi, {
            method: "POST",
            body: "message=" + message,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        }).json();
        resolve(this.checkBanphrase);
      
      }); 