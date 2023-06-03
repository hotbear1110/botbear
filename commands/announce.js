const { got } = require('./../got');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'announce',
	ping: true,
	description: 'spam announces something',
	permission: 1500,
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
            const channel_uid = (await sql.Query('SELECT uid FROM Streamers WHERE username=?', [channel]))[0].uid.toString();

            let spamCount = input[2];
            let message = input.slice();
			message.shift();
			message.shift();

            if (+spamCount) {
                message.shift();
            } else {
                spamCount = 1;
            }

			message = message.join(' ');
		

            await Promise.allSettled(Array.from({length: spamCount})
                                            .fill(message)
                                            .map(async (message) => {
                try {
                    await got.post(`https://api.twitch.tv/helix/chat/announcements?broadcaster_id=${channel_uid}&moderator_id=${process.env.TWITCH_UID}`, {
					headers: {
						'client-id': process.env.TWITCH_USER_CLIENTID,
						'Authorization': process.env.TWITCH_USER_AUTH,
						'Content-Type': 'application/json'
					},
					json: {
                        'message': message,
                        'color':'purple'
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
