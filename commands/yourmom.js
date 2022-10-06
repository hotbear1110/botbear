const { getChatters } = require('./../tools/tools.js');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'yourmom',
	ping: false,
	description: 'Pings a random chatter with YOURM0M',
	permission: 100,
	category: 'Random command',
	opt_outable: true,
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

            const chatterlist = await tools.optOutList(await getChatters(channel), module.exports.name);

			if (!chatterlist.length) {
				return 'This channel has no chatters to ping FeelsBadMan';
			}
			let number = Math.floor(Math.random() * chatterlist.length);

			return `${aliascommand} ${chatterlist[number]}`;

		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
