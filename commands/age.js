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


			input[2].replace(regex.invisChar, '');

            if (input[2].match(/[&|$|/|.|?|-]|\bkb\b|^\bmelon\b/g) && !input[2].match(/^[./]me /)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
				input[2] = '. ' + input[2].charAt(0) + '\u{E0000}' + input[2].substring(1);
			}
			if (input[2].match(/^!/g)) {
				input[2] = '❗ ' + input[2].substring(1);
			}

			return `${input[2] ?? user.username} is ${age} years old.`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};