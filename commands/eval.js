require('dotenv').config();
const tools = require('../tools/tools.js');
const regex = require('../tools/regex.js');
const {VM} = require('vm2');

module.exports = {
	name: 'eval',
	ping: false,
	description: 'This command will let you execute js code in the bot and make it return the result. (The message gets checked for massping, banphrases etc.). Example: "bb eval "lole ".repeat(10);"',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			input = input.splice(2);
			let msg = input.join(' ');
            let invisChar2 = ['[\u{13fe}-\u{13ff}]', '[\u{17b4}-\u{17b5}]', '[\u{180b}-\u{180f}]', '[\u{1bca0}-\u{1bca3}]', '[\u{1d173}-\u{1d17a}]', '[\u{2000}-\u{200f}]', '[\u{2028}-\u{202f}]', '[\u{2060}-\u{206f}]', '[\u{61c}-\u{61d}]', '[\u{80}-\u{9f}]', '[\u{e0000}-\u{e0fff}]', '[\u{e47}-\u{e4d}]', '[\u{fe00}-\u{feff}]', '[\u{fff0}-\u{ffff}]', '\u{115f}', '\u{1160}', '\u{2800}', '\u{3164}', '\u{34f}', '\u{ad}', '\u{ffa0}'].join('|');
			msg.replace(regex.invisChar, '').replace(invisChar2, '');

            const vm = new VM({
                timeout: 10000,
                allowAsync: false,
                wasm: false,
                eval: false,
                console: 'off',
                sandbox: {}
            });
            const semicolonTerminated = msg.endsWith(';');

            msg = msg.toString().split(';');
            if (semicolonTerminated) msg = msg.slice(0, -1);


            if(!/\breturn\b/.test(msg[msg.length - 1])) { msg[msg.length - 1] = `return ${msg[msg.length - 1].trim()}`; }

            msg = await vm.run(`(() => { ${msg.join(';')} })()`);

            if (tools.isMod(user, channel) === false && perm < 2000 && msg.match(/[&|$|/|.|?|-]|\bkb\b|^\bmelon\b/g)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
				msg = msg.charAt(0) + '\u{E0000}' + msg.substring(1);
			}
			if (msg.match(/!/g)) {
				msg = '❗ ' + msg.substring(1);
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
			return 'FeelsDankMan ' + err.toString().split('\n')[0];
		}
	}
};