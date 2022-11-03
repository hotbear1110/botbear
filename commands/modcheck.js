const tools = require('../tools/tools.js');

module.exports = {
	name: 'modcheck',
	ping: true,
	description: 'This command will tell you if a given user is a mod in a given channel. And for how long. Example: "bb modcheck Fawcan NymN"(this will check Fawcan´s mod status in Nymn´s channel)',
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let username = user.username;
			if (input[2]) {
				if (input[2].startsWith('@')) {
					input[2] = input[2].substring(1);
				}
				username = input[2].toLowerCase();
			}
			let realchannel = channel;
			if (input[3]) {
				realchannel = input[3];
			}
			let ismod = await tools.getMods(realchannel);
			let modresponse = '';
			for (const modstatus of ismod) {
				if (modstatus.login == username) {
					let moddate = modstatus.grantedAt;
					const ms = new Date().getTime() - Date.parse(moddate);
					modresponse = `that user has been a M OMEGALUL D in #${tools.unpingUser(realchannel)} for - (${tools.humanizeDuration(ms)})`;
				}
			}
			if (modresponse != '') {
				return modresponse;
			}
			else {
				return `That user is not a mod in #${tools.unpingUser(realchannel)} :)`;
			}

		} catch (err) {
			console.log(err);
			if (err.name) {
				if (err.name === 'TimeoutError') {
					return `FeelsDankMan api error: ${err.name}`;
				}
			}
			return 'FeelsDankMan Error';
		}
	}
};