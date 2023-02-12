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

			const url = `https://www.twitch.tv/directory/game/Pools%2C%20Hot%20Tubs%2C%20and%20Beaches?language=en`;

			const response = await got(url);

			const pattern = /"streamPreviewLink":"(.+?)"/g;

			let match;
			const streamLinks = [];

			while ((match = pattern.exec(response.body)) !== null) {
				streamLinks.push(match[1]);
			}

			if (streamLinks.length === 0) {
				return `No streams found for ${streams[rand]}.`;
			}

			const stream = streamLinks[Math.floor(Math.random() * streamLinks.length)];

			return `Here you go: ${stream}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};