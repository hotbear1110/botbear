const cc = require('../bot.js').cc;

module.exports = {
	name: 'spam',
	ping: true,
	description: 'spam something',
	permission: 2000,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let message = input.slice();
			message.shift();
			message.shift();
			message.shift();

			message = message.toString().replaceAll(',', ' ');
			
			Array.from({length: input[2]}).fill(message).map(x => cc.say(channel, x));

			return;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};