const tools = require("../tools/tools.js");
const _ = require("underscore");

module.exports = {
    name: "emotes",
    ping: true,
    description: 'This command will give you a list of the last 6 added 3rd part emotes.',
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

            if (input[2]) {
                if (input[2].startsWith("-") || input[2] === "0") {
                    return `2nd input can't be negative or 0`;

                }
                let isnumber = !isNaN(input[2]);
                if (!isnumber) {
                    return `2nd input should be a number`;
                }
                if (input[2] !== "1") {
                    emotes = emotes.slice(-(12 * (input[2] - 1))).reverse();
                    emotes = emotes.slice((6 * (input[2] - 2) + (6 * (input[2] - 1))))
                } else {
                    emotes = emotes.slice(-6).reverse();
                }
            } else {
                emotes = emotes.slice(-6).reverse();
            }
            if (!emotes.length) {
                return `monkaS You are going too far now`
            }

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
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}