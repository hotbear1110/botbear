const tools = require("../tools/tools.js");
const _ = require("underscore");

module.exports = {
    name: "removed",
    ping: true,
    description: "Responds with the last 6 removed emotes",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            const streamer = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
            let emotes = JSON.parse(streamer[0].emote_removed);

            if (!emotes.length) {
                return `there are no removed emotes in this channel yet.`
            }

            emotes = emotes.reverse();

            console.log(emotes)

            const now = new Date().getTime();

            _.each(emotes, async function (emote) {
                console.log(emote)

                emote[2] = `(${tools.humanizeDuration(now - emote[2])})`;

                emote.splice(1, 1); 

            })

            emotes = emotes.toString().replaceAll(',', ' ');

            return `the latest removed emotes are: ${emotes}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}