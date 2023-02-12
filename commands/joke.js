const { got } = require('./../got');

module.exports = {
	name: 'joke',
	description: 'Tells a random joke',
	ping: true,
	permission: 100,
	category: 'Fun command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			
			const response = await got('https://official-joke-api.appspot.com/random_joke').json();
			
			return `${response.setup} ${response.punchline}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
