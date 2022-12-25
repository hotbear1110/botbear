const tools = require('../tools/tools.js');
const { got } = require('./../got');

module.exports = {
	name: 'deveval',
	ping: true,
	description: 'This command will let you execute js code in the bot and make it return the result. Example: "bb deveval "lole ".repeat(10);',
	permission: 2000,
	cooldown: 3, //in seconds
	category: 'Dev command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: false,
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            input = input.splice(2);
			let msg = input.join(' ');
            const js = await eval(async () => { msg; });

			return await JSON.stringify(js);
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};