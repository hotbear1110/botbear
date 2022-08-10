require('dotenv').config();
const tools = require('../tools/tools.js');
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
			let msg = input.toString().replaceAll(',', ' ');

			msg.replace(regex.invisChar, '');


			if (tools.isMod(user, channel) === false && perm < 2000 && msg.match(/[&|$|/|.|?|!|-]|\bkb\b|^\bmelon\b/g)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
				msg = msg.charAt(0) + '\u{E0000}' + msg.substring(1);
			}

			if (perm < 2000 && msg.match(/(\.|\/)color/g)) {
				return 'cmonBruh don\'t change my color';
			}

			if (msg.toLowerCase().startsWith(`/ban ${process.env.TWITCH_OWNERNAME}`) || msg.toLowerCase().startsWith(`/timeout ${process.env.TWITCH_OWNERNAME}`) || msg.toLowerCase().startsWith(`/unmod ${process.env.TWITCH_USER}`)) {
				return `nymnWeird too far @${user.username}`;
			}

			return msg;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};