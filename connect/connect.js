require("dotenv").config();
const mysql = require("mysql2");
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectTimeout: 10000,
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
let channelOptions = ["hottestbear"];
async function res() {
  if (process.platform === "win32") {
    console.log(`Imported channels from database: ${channelOptions}`);
    return;
  }
  channelList.push(await getChannels());
  await channelList[0].forEach((i) => {
    if (i.username !== "hottestbear") {
      channelOptions.push(i.username);
    }
  });
  //Temp adding xqc, to test performance
  channelOptions.push("xqc")
  console.log(`Imported channels from database: ${channelOptions}`);
}

if (!process.env.TWITCH_USER === "devbear1110") {
  res();
}

let options = {
  options: {
    joinInterval: 0,
  },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_USER,
    password: process.env.TWITCH_PASSWORD,
  },
  channels: channelOptions,
};

module.exports = { options, con, channelOptions };
