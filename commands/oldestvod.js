const got = require('got');

module.exports = {
	name: 'oldestvod',
	ping: true,
	description: 'This command will give you a link to the oldest available twitch vod for a given channel',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let realchannel = channel;

			if (input[2]) {
				if (input[2].startsWith('@')) {
					input[2] = input[2].substring(1);
				}
				realchannel = input[2];
			}

			const userID = await got(`https://api.ivr.fi/twitch/resolve/${realchannel}`, { timeout: 10000 }).json();

			if (userID.status === 404) {
				return `Could not find user: "${realchannel}"`;
			}

			let vodList = await got(`https://api.twitch.tv/helix/videos?user_id=${userID.data.id}&type=archive&first=100`, {
				headers: {
					'client-id': process.env.TWITCH_CLIENTID,
					'Authorization': process.env.TWITCH_AUTH
				},
				timeout: 10000
			}).json();

			vodList = vodList.data;

			if (!vodList.length) {
				return 'That channel has no vods';
			} else if (vodList.length === 100) {
				return `${vodList[vodList.length - 1].url}?t=0s (This is vod number 100, I can only go 100 vods back so this might not be the oldest vod.)`;
			} else {
				return `${vodList[vodList.length - 1].url}?t=0s (#${vodList.length - 1})`;
			}
		} catch (err) {
			console.log(err);
			if (err.name) {
				if (err.name === 'TimeoutError') {
					return `FeelsDankMan api error: ${err.name}`;
				}
			}
			return `FeelsDankMan Error: ${err.response.data.error}`;
		}
	}
};