const got = require('got');

module.exports = {
	name: 'randomfounders',
	ping: true,
	description: 'Gets a random founder from a given channel',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Info Command',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let realchannel = channel;
			if (input[2]) {
				realchannel = input[2];
			}
			let founders = await got(`https://api.ivr.fi/v2/twitch/founders/${realchannel}`, { timeout: 10000 }).json();
			founders = founders['founders'];
			let number = Math.floor(Math.random() * (founders.length - 0) + 0);
			
			let isSubbed = (founders[number].isSubscribed) ? '' : 'not';

			return `Random founder in #${realchannel[0]}\u{E0000}${realchannel.slice(1)} 👉  ${founders[number].displayName}, they are currently ${isSubbed} subbed.`;

        } catch (err) {
			console.log(err.response);
			if (err.response.statusCode === 404) {
				return JSON.parse(err.response.body).error.message;
			}
			return 'FeelsDankMan Error';
		}
	}
};