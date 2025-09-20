require('dotenv').config();
const regex = require('../tools/regex.js');

module.exports = {
	name: 'say',
	ping: false,
	description: 'This command will let you make the bot say anything in chat. (The message gets checked for massping, banphrases etc.). Example: "bb say NymN is soy lole"',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			input = input.splice(2);
			let msg = input.join(' ');

			msg.replace(regex.invisChar, '');

            if (perm < 2000 && msg.match(/[&|$|/|.|?|-]|\bkb\b|^\bmelon\b|^\bkloy\b/gm)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
				msg = '. ' + msg.charAt(0) + '\u034f' + msg.substring(1);
			}
			if (msg.match(/^!/gm)) {
				msg = '❗ ' + msg.replace('!', '');
			}

			if (perm < 2000 && msg.match(/(\.|\/)color/gm)) {
				return 'cmonBruh don\'t change my color';
			}
			const banRegex = new RegExp(`[./](ban|timeout|unmod) ${process.env.TWITCH_OWNERNAME}`,'gi');
			if (msg.match(banRegex)) {
				return `nymnWeird too far @${user.username}`;
			}

			return msg;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};