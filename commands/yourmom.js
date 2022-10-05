const { getChatters } = require('./../tools/tools.js');

module.exports = {
	name: 'yourmom',
	ping: false,
	description: 'Pings a random chatter with YOURM0M',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

            const chatterlist = await getChatters(channel);

			let number = Math.floor(Math.random() * chatterlist.length);

			return `${aliascommand} ${chatterlist[number]}`;

		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};