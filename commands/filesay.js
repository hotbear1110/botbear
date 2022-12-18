const { got } = require('./../got');
const cc = require('../bot.js').cc;

module.exports = {
	name: 'filesay',
	ping: true,
	description: 'writes a message in chat for every line in the given file',
	permission: 2000,
	cooldown: 3, //in seconds
	category: 'Dev command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: false,
	channelSpecific: false,
	activeChannel: '',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
                let apicall = await got(input[2]);
                apicall.body.split('\n').map(x => cc.say(input[3] ?? channel, x));

                return;
        } catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
