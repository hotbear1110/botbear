require('dotenv').config()
const mysql = require("mysql2");


let client = {
  username: process.env.TWITCH_USER,
  password: process.env.TWITCH_PASSWORD,
};


const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});


const getChannels = () =>
  new Promise((resolve, reject) => {
    con.query("SELECT * FROM Streamers", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });



const channelList = [];
const channelOptions = [];
async function channels() {
  channelList.push(await getChannels());
  await channelList[0].forEach((i) => {
    channelOptions.push(i.username);
  });
  return channelOptions
}

module.exports = {
  con,
  client,
  channels: channels
}