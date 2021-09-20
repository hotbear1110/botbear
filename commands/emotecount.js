const tools = require("../tools/tools.js");

module.exports = {
    name: "emotecount",
    ping: true,
    description: "Responds with the amount of 3rd party emotes active in the channel",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (this.permission > perm) {
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
            return ` Error FeelsBadMan `;
        }
    }
}