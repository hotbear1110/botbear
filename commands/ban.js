const { got } = require('./../got');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'ban',
	ping: true,
	description: 'bans a user for every line in the given file',
	permission: 2000,
	cooldown: 3, //in seconds
	category: 'Dev command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: false,
	channelSpecific: false,
	activeChannel: '',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
                const apicall = await got(input[2]);
                const min = 0 || input[3];
                const channel_uid = (await sql.Query('SELECT uid FROM Streamers WHERE username=?', [channel]))[0].uid;

                const users = apicall.body.split('\n');

                const query = `
			    query {
                    users(logins: ["${users.join('", "')}"]) {
                        id
                    }
                  }`;

                  const users_uid = await got.post('https://gql.twitch.tv/gql', {
				headers: {
					'Client-ID': process.env.THREELETTERAPI_CLIENTID,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: query
				}),
			}).json();
            console.log(usersz);
            console.log(users_uid);
            await Promise.allSettled(users_uid.data.users.map(async x =>  await got.post(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${channel_uid}&moderator_id=${process.env.TWITCH_UID}`, {
					headers: {
						'client-id': process.env.TWITCH_CLIENTID,
						'Authorization': process.env.TWITCH_USER_AUTH,
						'Content-Type': 'application/json'
					},
					json: {
						'data': {
							'user_id': x.id,
							'duration': min * 60,
							'reason': 'Muted for notification spam'
						}
					}
				} ).json()));

                return;
        } catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
