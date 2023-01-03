const { got } = require('./../got');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'founders',
	ping: true,
	description: 'Gives you a list of founders from a given channel. * means that the user is currently subbed',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Info command',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let realchannel = channel;
			if (input[2]) {
				realchannel = input[2].toLowerCase();
			}
			let founders = await got(`https://api.ivr.fi/v2/twitch/founders/${realchannel}`).json();
			founders = founders['founders'];
			
            if (!founders.length) {
                return 'There are no users with points in this channel';
            }
            founders = founders.map(x => `${tools.unpingUser(x.login)}${(x.isSubscribed) ? '*' : ''}`)
								.toString()
								.replaceAll(',', ', ');

            return `Founders in #${realchannel}: ${founders}`;
        } catch (err) {
			console.log(err);
            if (err.response.statusCode === 404) {
				return JSON.parse(err.response.body).error.message;
			}
			return 'FeelsDankMan Error';
		}
	}
};