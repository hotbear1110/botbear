require('dotenv').config();
const sql = require('../sql/index.js');
const { got } = require('./../got');
const querystring = require('querystring');

const channelOptions = [process.env.TWITCH_OWNERNAME];

const client_id = process.env.TWITCH_CLIENTID;
const client_secret = process.env.TWITCH_SECRET;
let password = process.env.TWITCH_PASSWORD;

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
		password: password,
	},
	channels: channelOptions,
};

exports.setupChannels = new Promise(async (Resolve) => {
	(await sql.Query('SELECT username FROM Streamers WHERE `banned` = ? AND `have_left` = ?', [0, 0]))
		.map(({ username }) => (username === process.env.TWITCH_OWNERNAME) ? true : channelOptions.push(username));

	console.log(`Imported channels from database: ${channelOptions}`);

	const old_refresh_token = (await sql.Query('SELECT refresh_token FROM Auth_users WHERE uid = ?', [process.env.TWITCH_UID]))[0].refresh_token;
	console.log('test');

	const refresh = await got.post('https://id.twitch.tv/oauth2/token?' +
		querystring.stringify({
			client_id: client_id,
			client_secret: client_secret,
			grant_type: 'refresh_token',
			refresh_token: old_refresh_token
		})).json();

		if (!refresh.error) {
			const expires_in = Date.now() + refresh.expires_in;

			await sql.Query('UPDATE Auth_users SET access_token = ?, refresh_token = ?, expires_in = ? WHERE uid = ?', [refresh.access_token, refresh.refresh_token, expires_in, process.env.TWITCH_UID]);
	
			this.TMISettings.identity.password = 'oauth:' + refresh.access_token;
			console.log('setupChannel - ' + password);
		} else {
			throw('setupChannels error');
		} 
		Resolve(password);
});