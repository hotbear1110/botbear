const { max } = require('underscore');
const { got } = require('./../got');
const convert = require('xml-js');

module.exports = {
	name: 'booru',
	ping: true,
	description: 'Gives you a random image of whatever you want',
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

            let search = input.slice(2);

            let queryCheck = await got(`https://safebooru.org/autocomplete.php?q=${search}`).json();

            console.log(queryCheck);

            if (queryCheck.length) {
                queryCheck = " | Similar Queries: " + queryCheck.map(x => x.value).join(' - ');
            } else {
                queryCheck = "";
            }

            const maxRequestscheck = await got(`https://safebooru.org/index.php?page=dapi&s=post&q=index&limit=1&tags=${search}&pid=0`);

            const maxRequestsCheckxml = convert.xml2json(maxRequestscheck.body, {compact: true, spaces: 4});

            const maxRequestsCheckjson = JSON.parse(maxRequestsCheckxml);

            const pidMax = maxRequestsCheckjson.posts._attributes.count;

            if (pidMax == 0) {
                return 'No images found for that query' + queryCheck;
            }

            const booruRequest = await got(`https://safebooru.org/index.php?page=dapi&s=post&q=index&limit=1&tags=${search}&pid=${~~(Math.random() * pidMax - 1)}`);

            const xml = convert.xml2json(booruRequest.body, {compact: true, spaces: 4});

            const json = JSON.parse(xml);

			return `nymnAww ${json.posts.post._attributes.file_url}` + queryCheck;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
