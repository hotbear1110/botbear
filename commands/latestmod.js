const tools = require('../tools/tools.js');

module.exports = {
	name: 'latestmod',
	ping: true,
	description: 'This command will give you the name if the newest mod in a given channel',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let realchannel = channel;
			if (input[2]) {
				realchannel = input[2];
			}
			let mods = await tools.getMods(realchannel);
			let ms = new Date().getTime() - Date.parse(mods[mods.length - 1].grantedAt);
			return `The newest M OMEGALUL D in #${realchannel[0]}\u{E0000}${realchannel.slice(1)} is ${mods[mods.length - 1].displayName}, they were added ${tools.humanizeDuration(ms)} ago.`;

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