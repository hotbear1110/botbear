const got = require('got');

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

			return `${aliascommand} ${chatterlist[number]}`;

		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};