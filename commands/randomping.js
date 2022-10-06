const { getChatters } = require('../tools/tools.js');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'randomping',
	ping: false,
	description: 'This command will make the bot ping a random user in chat.',
	permission: 100,
	category: 'Random command',
	opt_outable: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

            const chatterlist = await tools.optOutList(await getChatters(channel, module.exports.name));
			if (!chatterlist.length) {
				return 'This channel has no chatters';
			}

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