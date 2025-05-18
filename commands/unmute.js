const redis = require('./../tools/redis.js');
const { got } = require('./../got');
const twitchAuth = require('../tools/twitchAuth.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'unmute',
	ping: true,
	description: 'Unmutes bot notifications',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Notify command',
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
            const isMod = user.mod || user['user-type'] === 'mod';
            const isBroadcaster = channel.toLowerCase() === user.username.toLowerCase();

            if (!isMod && !isBroadcaster && perm < 2000) {
                return;
            }

            await redis.Get().Set(`${channel}:unmute_time`, 0);

			if (channel === 'nymn') {
				const uid = (await sql.Query('SELECT uid FROM Streamers WHERE username = ?',[channel]))[0]?.uid;
				
				const twitch_user = await twitchAuth.fetchToken(uid);

				if (twitch_user.error) {
					return 'Something went wrong when refreshing user token DinkDonk @HotBear1110';
				}

				if (twitch_user.no_auth) {
					return 'Bot is not authorized DinkDonk @HotBear1110';
				}

				const access_token = twitch_user.access_token;

				await got.delete(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=62300805&moderator_id=${process.env.TWITCH_UID}&user_id=268612479`, {
					headers: {
						'client-id': process.env.TWITCH_CLIENTID,
						'Authorization': 'Bearer ' + access_token,
					}
				} ).json();
			}

			return 'Successfully unmuted notifications';
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};