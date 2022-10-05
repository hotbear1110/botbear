const { getChatters } = require('../tools/tools.js');

module.exports = {
	name: 'randomping',
	ping: false,
	description: 'This command will make the bot ping a random user in chat.',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            const chatterlist = await getChatters(channel);
			let number = Math.floor(Math.random() * chatterlist.length);

			return `:tf: 🔔 ${chatterlist[number]}`;

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