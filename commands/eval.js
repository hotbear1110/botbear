const regex = require('../tools/regex.js');
const {VM} = require('vm2');

module.exports = {
	name: 'eval',
	ping: false,
	description: 'This command will let you execute js code in the bot and make it return the result. (The message gets checked for massping, banphrases etc.). Example: "bb eval "lole ".repeat(10);"',
	permission: 1500,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			input = input.splice(2);
			let msg = input.join(' ');

			msg.replace(regex.invisChar, '');

            msg = await new VM().run(msg).toString();

			if (perm < 2000 && msg.match(/[&|$|/|.|?|-|!]|\bkb\b|^\bmelon\b/g)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
				msg = msg.charAt(0) + '\u{E0000}' + msg.substring(1);
			}
			return msg;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan ' + err.toString().split('\n')[0];
		}
	}
};