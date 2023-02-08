const { got } = require('./../../got');
const tools = require('./../../tools/tools.js');

module.exports = {
	name: 'redeems',
	ping: true,
	description: 'Shows the latest channelpoint redeemed emotes',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'channelSpecific command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: true,
	channelSpecific: true,
	activeChannel: ['nymn'],
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            const emotes = await got('https://bot-api.gempir.com/api/emotelog?channel=nymn&limit=100').json();

            let response = emotes.filter(x => x.Type === 'seventv').map(x => `${x.EmoteCode} by ${tools.unpingUser(x.AddedBy)}`).slice(0, 10).join(', ');

			return response;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};