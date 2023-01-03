const redis = require('./../tools/redis.js');
const cc = require('../bot.js').cc;

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
				cc.say(channel, '/unban TitleChange_Bot');
			}

			return 'Successfully unmuted notifications';
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};