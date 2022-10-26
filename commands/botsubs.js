require('dotenv').config();
const { got } = require('./../got');

module.exports = {
	name: 'botsubs',
	ping: true,
	description: 'This command will return random sub-emotes from channels the bot is subbed to',
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

			let query = `
			query {
                user(id: "${process.env.TWITCH_UID}") {
                    subscriptionBenefits(criteria: {}) {
                        edges  {
                            node {
                                user {
                                    subscriptionProducts {
                                        tier,
                                        emotes {
                                            token
                                        }         
                                    }
                                }
                            }
                        }
                    }
                }
            }`;

			let ThreeLetterApiCall = await got.post('https://gql.twitch.tv/gql', {
				headers: {
					'Client-ID': process.env.THREELETTERAPI_CLIENTID,
                    'Authorization': process.env.THREELETTERAPI_AUTH,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: query
				}),
			}).json();

            
			if (!ThreeLetterApiCall.data.user) {
				return 'FeelsDankMan Something went wrong!';
			}

            let emotes = ThreeLetterApiCall.
                                    data.
                                    user.
                                    subscriptionBenefits.
                                    edges.
                                    map(x => x.node.user.subscriptionProducts[0].emotes[~~(Math.random() * x.node.user.subscriptionProducts[0].emotes.length)].token);

			console.log(emotes);
			return  emotes;
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};