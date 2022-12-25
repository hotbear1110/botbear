const { got } = require('./../got');

module.exports = {
	name: 'rem2',
	ping: true,
	description: 'Gives you a random image of rem',
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
            const remRequest = await got('https://pastebin.com/raw/J7SxVQJg');

            const json = JSON.parse(remRequest.body);

            console.log(json);
            const image = json[~~(Math.random() * json.length - 1)].src.image;

			return `nymnAww ${image}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
