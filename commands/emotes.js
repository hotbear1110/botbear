const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');
const fetchEmote = require('../tools/fetchEmotes.js');

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

			/*
				TEMP SOLUTION UNTILL THE NEW EVENTSOURCE IS FINISHED
			*/

			const emote_list = []

			try {
				const uid = await tools.getUserID(this.channel);

				if (!uid) {
					return 'Unable to find the channel #' + this.channel;
				}

				emote_list = (await fetchEmote.STV_user_emotes(uid)).emote_list;
			} catch {
				console.log(err);
			}

			/*
			
			try {
				this.streamer = await sql.Query(`SELECT emote_list FROM Streamers WHERE username="${this.channel}"`) ?? '';
			} catch(err) {
				console.log(err);
				this.streamer =  '';
			}

			if (!this.streamer.length) {
				return 'I don\'t have an emote list for that channel.';
			}
			let emotes = JSON.parse(this.streamer[0].emote_list).reverse();

			*/
			
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

			const responseList = []

			for (const emote of emotes) {
				responseList.push(`${emote.name} (${tools.humanizeDuration(now - emote.time_added)})`)
			}

			emotes = responseList.join(' ');

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
