const regex = require('../tools/regex.js');

module.exports = {
	name: 'age',
	ping: false,
	description: 'guesses the age of a chatter',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: false,
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

            let age = ~~(Math.random() * 102 + 18);

			let user = input[2] ?? user.username;

			user.replace(regex.invisChar, '');

            if (user.match(/[&|$|/|.|?|-]|\bkb\b|^\bmelon\b/g) && !user.match(/^[./]me /)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
				user = '. ' + user.charAt(0) + '\u{E0000}' + user.substring(1);
			}
			if (user.match(/^!/g)) {
				user = '❗ ' + user.substring(1);
			}

			return `${user} is ${age} years old.`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};