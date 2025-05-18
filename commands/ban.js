const { got } = require('./../got');
const sql = require('./../sql/index.js');
const tools = require('../tools/tools.js');

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
                const min = input[3] ?? 0;
                const reason = input.slice(4).join(' ');
                const channel_uid = (await sql.Query('SELECT uid FROM Streamers WHERE username=?', [channel]))[0].uid.toString();

                const users = apicall.body.split(/\r?\n/);

				const userIDs = await tools.getUserIDs(users);


            await Promise.allSettled(userIDs.map(async (uid) => {
                try {
                    await got.post(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${channel_uid}&moderator_id=${process.env.TWITCH_UID}`, {
					headers: {
						'client-id': process.env.TWITCH_CLIENTID,
						'Authorization': process.env.TWITCH_AUTH,
						'Content-Type': 'application/json'
					},
					json: {
						'data': {
							'user_id': uid,
							'duration': min * 60,
							'reason': reason
						}
					}
				}).json();
            } catch (err) {
                    console.log(err);
                }
            }));

                return;
        } catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
