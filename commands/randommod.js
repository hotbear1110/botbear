const { got } = require('./../got');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'randommod',
	ping: true,
	description: 'This command will give you the name if a random mod in a given channel',
	permission: 100,
	category: 'Info command',
	opt_outable: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let realchannel = channel;
			if (input[2]) {
				realchannel = input[2];
			}
			let modcheck = await got(`https://api.ivr.fi/v2/twitch/modvip/${realchannel}`).json();
			let mods = modcheck['mods'];
			mods = await tools.optOutList(mods, module.exports.name, true);
			if (!mods.length) {
				return 'This channel has no mods';
			}
			let number = Math.floor(Math.random() * (mods.length - 0) + 0);

			let ms = new Date().getTime() - Date.parse(mods[number].grantedAt);
			return `Random M OMEGALUL D in #${realchannel[0]}\u{E0000}${realchannel.slice(1)} 👉  ${mods[number].displayName}, they were added ${tools.humanizeDuration(ms)} ago.`;

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