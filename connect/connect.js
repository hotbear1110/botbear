require('dotenv').config();
const sql = require('../sql/index.js');

const channelOptions = [process.env.TWITCH_OWNERNAME];

exports.setupChannels = new Promise(async(Resolve) => {
	(await sql.Query('SELECT username FROM Streamers WHERE `banned` = ? AND `left` = ?', [0, 0]))
		.map(({ username }) => (username === process.env.TWITCH_OWNERNAME) ? true : channelOptions.push(username));

	console.log(`Imported channels from database: ${channelOptions}`);
	Resolve();
});

exports.TMISettings = {
	options: {
		joinInterval: process.env.BOT_VERIFIED ? 300 : 2000,
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
