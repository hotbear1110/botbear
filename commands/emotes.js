const tools = require("../tools/tools.js");
const _ = require("underscore");

module.exports = {
    name: "emotes",
    ping: true,
    description: "Responds with the last 6 added 3rd party emotes",
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

            emotes = emotes.slice(-6).reverse();

            console.log(emotes)

            const now = new Date().getTime();

            _.each(emotes, async function (emote) {
                console.log(emote)

                emote[2] = `(${tools.humanizeDuration(now - emote[2])})`;

                emote.splice(1, 1);
                emote.splice(2, 3);

            })

            emotes = emotes.toString().replaceAll(',', ' ');

            return `the latest added emotes are: ${emotes}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}