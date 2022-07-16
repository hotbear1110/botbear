const got = require('got');
const tools = require('../tools/tools.js');


module.exports = {
	name: 'followage',
	ping: false,
	description: 'This command will give you the time a given user has followed a given channel. Example: "bb followage HotBear1110 NymN"',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let username = user.username;
			if (input[2]) {
				if (input[2].startsWith('@')) {
					username = input[2].substring(1);
				} else {
					username = input[2];
				}
			}
			let realchannel = channel;
			if (input[3]) {
				if (input[3].startsWith('@')) {
					realchannel = input[3].substring(1);
				} else {
					realchannel = input[3];
				}
			}

			const followcheck = await got(`https://api.ivr.fi/twitch/subage/${username}/${realchannel}`, { timeout: 10000 }).json();

			if (followcheck['followedAt']) {
				const ms = new Date().getTime() - Date.parse(followcheck['followedAt']);
				return `${username} has been following #${realchannel} for (${tools.humanizeDuration(ms)})`;
			}
			return `${username} does not follow #${realchannel}.`;
		} catch (err) {
			console.log(err);
			if (err.name) {
				if (err.name === 'TimeoutError') {
					return `FeelsDankMan api error: ${err.name}`;
				}
			}
			return 'FeelsDankMan Error';
		}
	}
};