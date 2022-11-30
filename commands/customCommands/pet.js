const sql = require('./../../sql/index.js');

module.exports = {
	name: 'pet',
	ping: true,
	description: 'Shows an image of a pet from a random chatter',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'channelSpecific command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: true,
	channelSpecific: true,
	activeChannel: 'yabbe',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

            const pets = await sql.Query('SELECT * FROM Yabbe_pet',);

            const pet =  pets[~~(Math.random() * pets.length - 1)];


			return `Random pet image: User: ${pet.User} | Pet: ${pet.Pet} | Pet Name: ${pet.Pet_name} | Image: ${pet.Image} `;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};