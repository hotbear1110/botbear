const sql = require('./../sql/index.js');

module.exports = {
	name: 'randomask',
	ping: true,
	description: 'Gives you an random ask response',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command', 
	opt_outable: false,
	showDelay: false,
	noBanphrase: false,
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

            const prompts = await sql.Query('SELECT Response FROM Ask',);

            const prompt =  prompts[~~(Math.random() * prompts.length - 1)];

			return prompt.Response;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};