const { got } = require('./../got');

module.exports = {
	name: 'rabbit',
	ping: true,
	description: 'This command will give you a link to a picture of a random rabbit',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			const image = await got('https://rabbit-api-two.vercel.app/api/random').json();

			return `🐰 ${image.url}`;

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