module.exports = {
    name: "emotecount",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
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