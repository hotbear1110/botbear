const got = require('got');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'founders',
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
			
            if (!founders.length) {
                return 'There are no users with points in this channel';
            }
            founders = founders.map(x => `Username: ${x.login} - Is currently subbed: ${x.isSubscribed}`);
            founders = founders.toString().replaceAll(',', '\n');

            let hastebinlist = await tools.makehastebin(`Founders in #${realchannel}:\n\n${founders}`);

            return `Founders in #${realchannel}: ${hastebinlist}.txt`;
        } catch (err) {
			console.log(err);
            if (err.response.statusCode === 404) {
				return JSON.parse(err.response.body).error.message;
			}
			return 'FeelsDankMan Error';
		}
	}
};