const { got } = require('./../got');

module.exports = {
	name: 'vipcount',
	ping: true,
	description: 'This command will give you the number of channels a given user is a vip in. Example: "bb vipcount NymN"',
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
				username = input[2];
			}
			let vipcount = await got(`https://api.twitchdatabase.com/roles/${username}`).json();
			const isvip = vipcount.vipIn['total'];
			if (isvip === 0) {
				return 'That user is not a vip in any channel :)';
			}
			return `That user is a vip😬 in ${isvip} channel('s)`;
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