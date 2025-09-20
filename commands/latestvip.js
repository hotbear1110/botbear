const tools = require('../tools/tools.js');

module.exports = {
	name: 'latestvip',
	ping: true,
	description: 'This command will give you the name if the newest vip in a given channel',
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let realchannel = channel;
			if (input[2]) {
				realchannel = input[2];
			}
			let vips = await tools.getVips(realchannel);

			let ms = new Date().getTime() - Date.parse(vips[vips.length - 1].grantedAt);
			return `The newest vip😬 in #${realchannel[0]}\u034f${realchannel.slice(1)} is ${vips[vips.length - 1].displayName}, they were added ${tools.humanizeDuration(ms)} ago.`;

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