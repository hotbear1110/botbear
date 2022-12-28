const redis = require('./../tools/redis.js');

module.exports = {
	name: 'mute',
	ping: true,
	description: 'Mutes bot notifications for x minutes. Default is 1 min',
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

            let duration = input[2] * 60 * 1000 ?? 60 * 1000;

            let unmuteTime = Date.now() + duration;

            const mute = await redis.Get().Set(`${channel}:unmute_time`, unmuteTime);
            mute(duration / 1000);

			return `Successfully muted notifications for ${input[2]} min`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};