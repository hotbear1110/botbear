const tools = require("../tools/tools.js");

module.exports = {
    name: "test2",
    ping: true,
    description: 'This command will give you the number of 3rd party emotes, that are currently activated in the chat.',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const streamer = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
            let emotes = JSON.parse(streamer[0].emote_list);


            let seventvcount = emotes.filter(emote => emote.includes(`["7tv"]`) || emote.includes("7tv") || emote.includes("7tv_ZERO_WIDTH"));
            let bttvccount = emotes.filter(emote => emote.includes("bttv"));
            let ffzcount = emotes.filter(emote => emote.includes("ffz"));

            if (!emotes.length) {
                return `there are no 3rd party emotes in this channel.`
            }
            else {
                return `There are ${emotes.length} 3rd party emotes in this channel | BTTV: ${bttvccount.length} FFZ: ${ffzcount.length} 7TV: ${seventvcount.length}`
            }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}