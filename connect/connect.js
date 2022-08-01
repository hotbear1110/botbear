require('dotenv').config();
const sql = require('../sql/index.js');

const channelOptions = [];

exports.setupChannels = async () => {
	channelOptions.push(process.env.TWITCH_OWNERNAME);
	(await sql.Query('SELECT * FROM Streamers'))
		.map(async ({ username }) => {
			if (username !== process.env.TWITCH_OWNERNAME) {
				channelOptions.push(username);
			}
		});
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
