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

			var i = 0;
			while (i < input[2]) {
				cc.say(channel, message);
				i++;
			}

			return;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};