const got = require('got');

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
			let chatters = await got(`https://tmi.twitch.tv/group/user/${channel}/chatters`, { timeout: 10000 }).json();

			let chatterlist = [];
			chatters = chatters['chatters'];
			chatterlist = chatterlist.concat(chatters['broadcaster']);
			chatterlist = chatterlist.concat(chatters['vips']);
			chatterlist = chatterlist.concat(chatters['moderators']);
			chatterlist = chatterlist.concat(chatters['staff']);
			chatterlist = chatterlist.concat(chatters['admins']);
			chatterlist = chatterlist.concat(chatters['global_mods']);
			chatterlist = chatterlist.concat(chatters['viewers']);

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