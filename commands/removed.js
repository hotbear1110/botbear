const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'removed',
	ping: true,
	description: 'This command will give you a list of the last 6 removed 3rd part emotes.',
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			const streamer = await sql.Query(`SELECT emote_removed FROM Streamers WHERE username="${channel}"`);
			let emotes = JSON.parse(streamer[0].emote_removed);

			if (!emotes.length) {
				return 'there are no removed emotes in this channel yet.';
			}

			if (input[2]) {
				if (input[2].startsWith('-') || input[2] === '0') {
					return '2nd input can\'t be negative or 0';

				}
				let isnumber = !isNaN(input[2]);
				if (!isnumber) {
					return '2nd input should be a number';
				}
				if (input[2] !== '1') {
					emotes = emotes.slice(-(12 * (input[2] - 1))).reverse();
					emotes = emotes.slice((6 * (input[2] - 2) + (6 * (input[2] - 1))));
				} else {
					emotes = emotes.slice(-6).reverse();
				}
			} else {
				emotes = emotes.slice(-6).reverse();
			}
			if (!emotes.length) {
				return 'monkaS You are going too far now';
			}

			const now = new Date().getTime();

			for (const emote of emotes) {
				emote[2] = `(${tools.humanizeDuration(now - emote[2])})`;

				if (emote[3]) {
					emote.pop();
				}

				emote.splice(1, 1);

			}

			emotes = emotes.toString().replaceAll(',', ' ');

			if (input[2]) {
				return `Removed emotes page[${input[2]}]: ${emotes}`;
			}
			return `The latest removed emotes are: ${emotes}`;

		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};