const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'emotes',
	ping: true,
	description: 'This command will give you a list of the last 6 added 3rd part emotes.',
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			this.channel = input.filter(x => x.startsWith('channel:'))[0]?.split(':')[1] ?? channel;
            input = input.filter(x  => x !== `channel:${this.channel}`);
			
			try {
				this.streamer = await sql.Query(`SELECT * FROM Streamers WHERE username="${this.channel}"`) ?? '';
			} catch(err) {
				console.log(err);
				this.streamer =  '';
			}

			if (!this.streamer.length) {
				return 'I don\'t have an emote list for that channnel.';
		}
			let emotes = JSON.parse(this.streamer[0].emote_list).reverse();

			
			if (!emotes.length) {
				return 'there are no 3rd party emotes in this channel.';
			}

			let index = input[2] || '1';

			if (index.startsWith('-') || index === '0') {
				return '2nd input can\'t be negative or 0';
			}
			let isnumber = !isNaN(index);
			if (!isnumber) {
				return '2nd input should be a number';
			}

			emotes = emotes.slice((6*(index-1)), (6*index));

			if (!emotes.length) {
				return 'monkaS You are going too far now';
			}

			const now = new Date().getTime();

			for (const emote of emotes) {
				emote[2] = `(${tools.humanizeDuration(now - emote[2])})`;

				emote.splice(1, 1);
				emote.splice(2, 3);

			}

			emotes = emotes.toString().replaceAll(',', ' ');

			if (input[2]) {
				return `Added emotes ${(this.channel === channel) ? '' : `in #${this.channel}`} page[${input[2]}]: ${emotes}`;
			}
			return `the latest added emotes ${(this.channel === channel) ? '' : `in #${this.channel}`} are: ${emotes}`;

		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};