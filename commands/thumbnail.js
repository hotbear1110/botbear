const { got } = require('./../got');

module.exports = {
	name: 'thumbnail',
	ping: true,
	description: 'Will return the latest thumbnail image of a given streamer',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: true,
	channelSpecific: false,
	activeChannel: '',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            let realchannel = input[2] ?? channel;

            const [userID] = await got(`https://api.ivr.fi/v2/twitch/user?login=${realchannel}`).json();

            if (userID.status === 404) {
                return `Could not find user: "${realchannel}"`;
            }

            const vodList = await got('https://api.twitch.tv/helix/videos', {
                headers: {
                    'client-id': process.env.TWITCH_USER_CLIENTID,
                    'Authorization': process.env.TWITCH_USER_AUTH
                },
                searchParams: {
                    'user_id': userID.id,
                    'type': 'archive',
                    'first': 100
                }
            }).json();

            if (!vodList.data.length) {
                return 'That user has no vods';
            }

            const thumbnail = vodList.data[0].thumbnail_url.replace('%{width}', '1920').replace('%{height}', '1080');

			return thumbnail;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
