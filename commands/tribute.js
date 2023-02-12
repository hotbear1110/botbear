const { got } = require('./../got');

module.exports = {
	name: 'tribute',
	description: 'Posts a link of a random Twitch streamer',
	ping: true,
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			
			const streams = ['https://www.twitch.tv/directory/game/Pools%2C%20Hot%20Tubs%2C%20and%20Beaches'];
			
			const rand = Math.floor(Math.random() * streams.length);
			
			const stream = await got(`https://api.twitch.tv/kraken/streams?limit=1&game=Pools%2C%20Hot%20Tubs%2C%20and%20Beaches&offset=${rand}`, {
				headers: {
					'Client-ID': 'YOUR_TWITCH_CLIENT_ID',
					'Accept': 'application/vnd.twitchtv.v5+json'
				}
			}).json();
			
			if (stream.streams.length === 0) {
				return `No streams found for ${streams[rand]}.`;
			}
			
			return `Here you go: ${stream.streams[0].channel.url}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};