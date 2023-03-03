const redis = require('./../tools/redis.js');
const { got } = require('./../got');

module.exports = {
	name: 'mute',
	ping: true,
	description: 'Mutes bot notifications for x minutes. Default is 5 min',
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

			let min = input[2]?.replaceAll('m', '') ?? '5';

			if (min.startsWith('-') || min === '0') {
				return '2nd input can\'t be negative or 0';

			}
			let isnumber = parseInt(min);
			if (isNaN(isnumber)) {
				return '2nd input should be a number';
			}

            let duration = min * 60 * 1000;

            let unmuteTime = Date.now() + duration;

            const mute = await redis.Get().Set(`${channel}:unmute_time`, unmuteTime);
            mute(duration / 1000);

			if (channel === 'nymn') {
				await got.post(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=62300805&moderator_id=${process.env.TWITCH_UID}`, {
					headers: {
						'client-id': process.env.TWITCH_CLIENTID,
						'Authorization': process.env.TWITCH_AUTH,
						'Content-Type': 'application/json'
					},
					json: {
						'data': {
							'user_id': '268612479',
							'duration': min * 60,
							'reason': 'Muted for notification spam'
						}
					}
				} ).json();
			}

			return `Successfully muted notifications for ${min} min`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};