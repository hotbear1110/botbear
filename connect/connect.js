require('dotenv').config();
const { reasonForValue } = require('dank-twitch-irc');
const sql = require('../sql/index.js');

const channelOptions = [process.env.TWITCH_OWNERNAME];

exports.setupChannels = new Promise(async(Resolve) => {
	(await sql.Query('SELECT * FROM Streamers'))
		.map(async ({ username }) => {
			if (username !== process.env.TWITCH_OWNERNAME) {
				channelOptions.push(username);
			}
		});
	console.log(`Imported channels from database: ${channelOptions}`);
	Resolve();
});

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
