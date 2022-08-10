const got = require('got');

module.exports = {
	name: 'dog',
	ping: true,
	description: 'This command will give you a link to a picture of a random dog',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			const image = await got('https://dog.ceo/api/breeds/image/random', { timeout: 10000 }).json();

			return `OhMyDog ${image.message}`;

		} catch (err) {
			console.log(err);
			if (err.name) {
				if (err.name === 'TimeoutError') {
					return `FeelsDankMan api error: ${err.name}`;
				}
			}
			return 'FeelsDankMan Error';
		}
	}
};