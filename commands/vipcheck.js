const tools = require('../tools/tools.js');

module.exports = {
	name: 'vipcheck',
	ping: true,
	description: 'This command will tell you if a given user is a vip in a given channel. And for how long. Example: "bb vipcheck HotBear1110 NymN"(this will check HotBear1110´s vip status in Nymn´s channel)',
	permission: 100,
	category: 'Info command',
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
			const isvip = await tools.getVips(channel);
			let vipresponse = '';

			for (const vipstatus of isvip) {
				if (vipstatus.login == username) {
					let vipdate = vipstatus.grantedAt;
					const ms = new Date().getTime() - Date.parse(vipdate);
					vipresponse = `that user has been a vip😬 in #${realchannel} for - (${tools.humanizeDuration(ms)})`;
				}
			}

			if (vipresponse != '') {
				return vipresponse;
			}
			return `That user is not a vip in #${realchannel} :) `;
		} catch (err) {
			console.log(err);
			if (err.name === 'TimeoutError') {
				return `FeelsDankMan api error: ${err.name}`;
			}
			return 'FeelsDankMan Error';
		}
	}
};