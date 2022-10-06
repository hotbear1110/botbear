const { got } = require('./../got');
const sql = require('./../sql/index.js');
const redis = require('./../tools/redis.js');

const CACHE_TIME = 60 * 60;

const getGlobals = async () => {
    const cache = await redis.Get().Get('helix:globals');
    if (cache) {
        return JSON.parse(cache);
    }
    const globalEmotes = await got('https://api.twitch.tv/helix/chat/emotes/global', {
        headers: {
            'client-id': process.env.TWITCH_CLIENTID,
            'Authorization': process.env.TWITCH_AUTH
        }
    }).json();

    saveGlobals(globalEmotes.data);

    return globalEmotes.data;
};

const saveGlobals = async (emotes) => {
    const b = await redis.Get().Set('helix:globals', JSON.stringify(emotes));
    await b(CACHE_TIME);
};

module.exports = {
	name: 'randomemote',
	ping: false,
	description: 'This command will respond with a random emote',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			const streamer = await sql.Query(`SELECT * FROM Streamers WHERE username="${channel}"`);
			let emotes = JSON.parse(streamer[0].emote_list);

            const globalEmotes = await getGlobals();
            
			emotes = emotes.concat(globalEmotes);
			let number = Math.floor(Math.random() * (emotes.length - 0) + 0);

			return emotes[number][0] || emotes[number].name;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};