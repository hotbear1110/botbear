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

			let username = input[2] ?? user.username;

			username.replace(regex.invisChar, '');

            if (username.match(/[&|$|/|.|?|-]|\bkb\b|^\bmelon\b/g) && !username.match(/^[./]me /)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
				username = '. ' + username.charAt(0) + '\u{E0000}' + username.substring(1);
			}
			if (username.match(/^!/g)) {
				username = '❗ ' + username.substring(1);
			}

			return `${username} is ${age} years old.`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};