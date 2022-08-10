const got = require('got');

module.exports = {
	name: 'chatters',
	ping: true,
	description: 'This command will give you the number of users, that are currently in the chat',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let { chatter_count } = await got(`https://tmi.twitch.tv/group/user/${channel}/chatters`, { timeout: 10000 }).json();

			return `There are ${chatter_count} users in chat rn :O`;
		} catch (err) {
			console.log(err);
			if (err.name) {
				if (err.name === 'TimeoutError') {
					return `FeelsDankMan api error: ${err.name}`;
				}
			}
			return `FeelsDankMan Error: ${err.response.data.error}`;
		}
	}
};