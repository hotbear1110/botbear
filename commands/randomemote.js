const tools = require("../tools/tools.js");
const got = require("got");
require('dotenv').config();

module.exports = {
    name: "randomemote",
    ping: false,
    description: 'This command will respond with a random emote',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const streamer = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
            let emotes = JSON.parse(streamer[0].emote_list);

            const globalEmotes = await got(`https://api.twitch.tv/helix/chat/emotes/global`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
                timeout: 10000
            }).json();

            emotes = emotes.concat(globalEmotes.data)
            let number = Math.floor(Math.random() * (emotes.length - 0) + 0);


            return "TriHard";
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}