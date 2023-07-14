const { got } = require('./../../got');

module.exports = {
	name: 'apollo',
	ping: true,
	description: 'The bot responds with a random picture of apollo',
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
            const apolloRequest = await got('https://pastebin.com/raw/UXbPxmd5');

            const json = JSON.parse(apolloRequest.body);

            console.log(json[0]);
            const image = json[~~(Math.random() * json.length - 1)].url;

			return `nymnAww ${image}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};