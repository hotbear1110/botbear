const { got } = require('./../got');

module.exports = {
	name: 'subcount',
	description: 'Gets the subscriber count for a specified channel.',
	ping: true,
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

			let channelName = input[2];
			if (channelName.startsWith('@')) {
				channelName = channelName.substring(1);
			}

			const url = `https://decapi.me/twitch/subcount/${channelName}`;

			const response = await got(url);

			if (response.body.trim() === '0') {
				return `${channelName} does not have any subscribers.`;
			}

			return `${channelName} has ${response.body.trim()} subscribers!`;

		} catch (err) {
			console.log(err);
			return 'An error occurred while trying to get the subscriber count.';
		}
	}
};