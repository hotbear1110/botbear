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
			if (input[2]) {
				if (input[2].startsWith('@')) {
					input[2] = input[2].substring(1);
				}
			} else {
				return 'Please specify a channel. FeelsDankMan';
			}
			let modresponse = await tools.isMod(user, input[2]);

			if (!modresponse && perm < 2000) {
				return 'You can only reconnect to your own chat or a chat you moderate';
			}

			const isinDB = await sql.Query('SELECT username FROM Streamers WHERE username=?', [input[2]]);
			if (!isinDB[0]) {
				return 'That streamer is not in my database';
			}
			cc.part(input[2]).catch((err) => {
				console.log(err);
			});

			cc.join(input[2]).catch((err) => {
				console.log(err);
			});
			new messageHandler(`#${input[2]}`, 'nymnDank reconnected to the chat!', true).newMessage();

			return `successfully reconnected to #${input[2]}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};