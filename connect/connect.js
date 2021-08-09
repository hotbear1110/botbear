require("dotenv").config();
const mysql = require("mysql2");
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

con.on("error", (err) => {
  if (err.fatal) {
    con.destroy();
  }
  throw err;
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
async function res() {
  channelList.push(await getChannels());
  await channelList[0].forEach((i) => {
    channelOptions.push(i.username);
  });
  console.log(`Imported channels from database: ${channelOptions}`);
}

res()

let options = {
  options: {
    debug: false,
  },
  connection: {
    secure: true,
  },
  identity: {
    username: process.env.TWITCH_USER,
    password: process.env.TWITCH_PASSWORD,
  },
  channels: channelOptions,
};

module.exports = { options, con, channelOptions};
