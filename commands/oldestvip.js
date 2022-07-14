const got = require('got');
const _ = require('underscore');
const tools = require('../tools/tools.js');


module.exports = {
	name: 'oldestvip',
	ping: true,
	description: 'This command will give you the name if the oldest vip in a given channel',
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
			let vipcheck = await got(`https://api.ivr.fi/twitch/modsvips/${realchannel}`, { timeout: 10000 }).json();
			let vips = vipcheck['vips'];

			let ms = new Date().getTime() - Date.parse(vips[0].grantedAt);
			return `The oldest vip😬 in #${realchannel[0]}\u{E0000}${realchannel.slice(1)} is ${vips[0].displayName}, they were added ${tools.humanizeDuration(ms)} ago.`;

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