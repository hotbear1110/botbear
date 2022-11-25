const cc = require('../bot.js').cc;
const { messageHandler } = require('../tools/messageHandler.js');
const sql = require('./../sql/index.js');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'reconnect',
	ping: true,
	description: 'Reconnects the bot to a given channel.',
	permission: 100,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let username = user.username;
			if (input[2]) {
				username = input[2];
				if (username.startsWith('@')) {
					username = username.substring(1);
				}
			}

			let modresponse = await tools.isMod(user, username);

			if (!await modresponse && perm < 2000) {
				return 'You can only reconnect to your own chat or a chat you moderate';
			}

			const isinDB = await sql.Query('SELECT username FROM Streamers WHERE username=?', [username]);
			if (!isinDB[0]) {
				return 'That streamer is not in my database';
			}
			cc.part(username).catch((err) => {
				console.log(err);
			});

			cc.join(username).catch((err) => {
				console.log(err);
			});
			new messageHandler(`#${username}`, 'nymnDank reconnected to the chat!', true).newMessage();

			return `successfully reconnected to #${username}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};