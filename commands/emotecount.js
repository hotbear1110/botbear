const tools = require("../tools/tools.js");

module.exports = {
    name: "emotecount",
    ping: true,
    description: 'This command will give you the number of 3rd party emtoes, that are currently activated in the chat.',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const streamer = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
            let emotes = JSON.parse(streamer[0].emote_list);

            if (!emotes.length) {
                return `there are no 3rd party emotes in this channel.`
            }
            else {
                return `There are ${emotes.length} 3rd party emotes in this channel.`
            }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;        
        }
    }
}