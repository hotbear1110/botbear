const { got } = require('./../got');

module.exports = {
	name: 'topclip',
	description: 'Gets the top clip of a specified channel. Example: "bb topclip NymN"',
	ping: true,
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			
			const realchannel = input[2] ? input[2].replace('@', '') : channel.replace('#', '');
			const url = `https://api.twitch.tv/helix/clips?broadcaster_id=${realchannel}&first=1`;
			
			const response = await got(url, {
				headers: {
					'Client-ID': 'YOUR_TWITCH_CLIENT_ID_HERE',
					'Authorization': 'Bearer YOUR_TWITCH_ACCESS_TOKEN_HERE',
					'Content-Type': 'application/json'
				},
				responseType: 'json'
			});
			
			const clip = response.body.data[0];
			if (!clip) {
				return `No clips found for ${realchannel}`;
			}
			
			return `Check out the top clip from ${realchannel}: ${clip.url}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};