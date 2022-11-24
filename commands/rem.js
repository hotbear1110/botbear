const { got } = require('./../got');
const convert = require('xml-js');

module.exports = {
	name: 'rem',
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
            let pidMax = 4840;
            const remRequest = await got(`https://safebooru.org/index.php?page=dapi&s=post&q=index&limit=1&tags=rem_%28re%3Azero%29&pid=${~~(Math.random() * pidMax)}`).json();

            const xml = convert.xml2json(remRequest.body, {compact: true, spaces: 4});

            const json = JSON.parse(xml);

			return `nymnAww ${json.posts.post._attributes.file_url}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
