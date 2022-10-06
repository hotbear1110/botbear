const { got } = require('./../got');
const redis = require('./../tools/redis.js');

const CACHE_TIME = 5 * 60;

module.exports = {
	name: 'chatters',
	ping: true,
	description: 'This command will give you the number of users, that are currently in the chat',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            const cache = await redis.Get().Get(`${channel}:chatters_count`);
            if (cache) {
                return `There are ${cache} users in the chat`;
            }

			const { chatter_count } = await got(`https://tmi.twitch.tv/group/user/${channel}/chatters`).json();
            const b = await redis.Get().Set(`${channel}:chatters_count`, chatter_count);
            b(CACHE_TIME);

			return `There are ${chatter_count} users in chat rn :O`;
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