require('dotenv').config();
const { got } = require('./../got');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'tags',
	ping: true,
	description: 'This command will give you a list of tags in a given channel',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            if (!process.env.THREELETTERAPI_CLIENTID) {
				return 'FeelsDankMan Error: THREELETTERAPI_CLIENTID isn`t set';
			}
            
			let realchannel = channel;

			if (input[2]) {
				if (input[2].startsWith('@')) {
					input[2] = input[2].substring(1);
				}
				realchannel = input[2];
			}
			let query = `
			query {
				user(login: "${realchannel}") {
						freeformTags {
							name
						}
				  }
			}`;

			let ThreeLetterApiCall = await got.post('https://gql.twitch.tv/gql', {
				headers: {
					'Client-ID': process.env.THREELETTERAPI_CLIENTID,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: query
				}),
			}).json();
			realchannel = tools.unpingUser(realchannel);

			if (!ThreeLetterApiCall.data.user) {
				return `FeelsDankMan ${realchannel} is not a real username`;
			} else if (!ThreeLetterApiCall.data.user.freeformTags.length) {
				return `${realchannel} does not have any tags`;
			}

			let tags = ThreeLetterApiCall.data.user.freeformTags.map(x => x.name).join(', ');
			console.log(`${realchannel}'s tags: ${tags}`);
			return  `${realchannel}'s tags: ${tags}`;
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};