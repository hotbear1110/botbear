require('dotenv').config();
const sql = require('../sql/index.js');

const channelOptions = [];

exports.setupChannels = async() => {
	(await sql.Query('SELECT username FROM Streamers'))
		.map(({ username }) => channelOptions.push(username));

	console.log(`Imported channels from database: ${channelOptions}`);
};

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
