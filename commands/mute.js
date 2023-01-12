const redis = require('./../tools/redis.js');
const cc = require('../bot.js').cc;

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

			input[2] = input[2]?.replaceAll('m', '');

			if (input[2].startsWith('-') || input[2] === '0') {
				return '2nd input can\'t be negative or 0';

			}
			let isnumber = !isNaN(input[2]);
			if (!isnumber) {
				return '2nd input should be a number';
			}

            let duration = input[2] * 60 * 1000 ?? 5 * 60 * 1000;

            let unmuteTime = Date.now() + duration;

            const mute = await redis.Get().Set(`${channel}:unmute_time`, unmuteTime);
            mute(duration / 1000);

			if (channel === 'nymn') {
				cc.say(channel, '/timeout TitleChange_Bot ' + input[2] + 'm' ?? 5 + 'm');
			}

			return `Successfully muted notifications for ${input[2] ?? 5} min`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};