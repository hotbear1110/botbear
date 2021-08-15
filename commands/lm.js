const got = require("got");
const cc = require("../bot.js").cc;

module.exports = {
    name: "lm",
    ping: false,
    execute: async (channel, user, input) => {
        try {
            let username = user.username;
            if (input[2]) {
                username = input[2];
            }
            if (username === "botbear1110" || username === "ksyncbot") {
                return;
            }

            const lm = await got(`https://api.ivr.fi/logs/lastmessage/${channel}/${username}`).json();

            if (lm.status !== 404) {
                cc.say(`#${channel}`, `FeelsDonkMan ${lm.user}'s last message here was: ${lm.response} - (${lm.time} ago)`)
            }

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan : No logs for that user in this chat`;
        }
    }
}