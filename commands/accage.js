const tools = require('../tools/tools.js');
const { got } = require('../got');
const helix = require('./../thirdparty/helix');

module.exports = {
	name: 'accage',
	ping: true,
	description: 'This command will tell you the specified users account age. Example: "bb accage NymN"',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let uid = user['user-id'];

			if (input[2]) {
				if (input[2].startsWith('@')) {
					input[2] = input[2].substring(1);
				}
				let username = input[2];
                
				uid = (await got(`https://api.ivr.fi/twitch/resolve/${username}`).json()).id;
			}

            const twitchdata = await helix.GetUsers({ids: [uid]});

            if (twitchdata.statusCode !== 200) {
                throw twitchdata.error;
            }
            
            const twitchUser = twitchdata.data[0];

			const ms = new Date().getTime() - Date.parse(twitchUser.created_at);

			return `Account is ${tools.humanizeDuration(ms)} old`;

		} catch (err) {
			console.log(err);
			if (err.name) {
				if (err.name === 'TimeoutError') {
					return `FeelsDankMan api error: ${err.name}`;
				}
			}
			return `FeelsDankMan Error: ${err.response.data.error}`;
		}
	}
};