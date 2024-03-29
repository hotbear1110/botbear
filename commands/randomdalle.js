const sql = require('./../sql/index.js');

module.exports = {
	name: 'randomdalle',
	ping: true,
	description: 'Gives you an random dalle image, another user has generated',
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

            const prompts = await sql.Query('SELECT * FROM Dalle',);

            const prompt =  prompts[~~(Math.random() * prompts.length - 1)];

			return `Random dalle prompt | User: ${prompt.User} | Prompt: ${prompt.Prompt} | Image: ${prompt.Image} | TimeStamp: ${prompt.Timestamp.toLocaleString()}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};