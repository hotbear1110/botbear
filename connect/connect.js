require("dotenv").config();
const mysql = require("mysql2/promise");
const sql = require("../sql/index.js");

const channelOptions = [process.env.TWITCH_OWNERNAME];

exports.setupChannels = async () => {
  (await sql.Query("SELECT * FROM Streamers"))
    .map(async ({ username }) => {
      if (username !== process.env.TWITCH_OWNERNAME) {
        channelOptions.push(username);
      }
    });
  console.log(`Imported channels from database: ${channelOptions}`);
}

exports.TMISettings = {
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
