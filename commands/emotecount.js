const sql = require('./../sql/index.js');

module.exports = {
	name: 'emotecount',
	ping: true,
	description: 'This command will give you the number of 3rd party emotes, that are currently activated in the chat.',
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

			const emoteChannel = input[2] ?? channel;

			const streamer = await sql.Query(`SELECT * FROM Streamers WHERE username="${emoteChannel}"`);

			if (!streamer.length) {
				return 'I don\'t have that streamer in my database'
			}

			let emotes = JSON.parse(streamer[0].emote_list);


			let seventvcount = emotes.filter(emote => emote.includes('["7tv"]') || emote.includes('7tv') || emote.includes('7tv_ZERO_WIDTH'));
			let bttvccount = emotes.filter(emote => emote.includes('bttv'));
			let ffzcount = emotes.filter(emote => emote.includes('ffz'));

			if (!emotes.length) {
				return `there are no 3rd party emotes in #${emoteChannel}.`;
			}
			else {
				return `There are ${emotes.length} 3rd party emotes in #${emoteChannel} | BTTV: ${bttvccount.length} FFZ: ${ffzcount.length} 7TV: ${seventvcount.length}`;
			}
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};