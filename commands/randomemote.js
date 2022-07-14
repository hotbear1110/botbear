const got = require('got');
const sql = require('./../sql/index.js');

require('dotenv').config();

module.exports = {
	name: 'randomemote',
	ping: false,
	description: 'This command will respond with a random emote',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			const streamer = await sql.Query(`SELECT * FROM Streamers WHERE username="${channel}"`);
			let emotes = JSON.parse(streamer[0].emote_list);

			const globalEmotes = await got('https://api.twitch.tv/helix/chat/emotes/global', {
				headers: {
					'client-id': process.env.TWITCH_CLIENTID,
					'Authorization': process.env.TWITCH_AUTH
				},
				timeout: 10000
			}).json();

			emotes = emotes.concat(globalEmotes.data);
			let number = Math.floor(Math.random() * (emotes.length - 0) + 0);


			return emotes[number][0] || emotes[number].name;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};