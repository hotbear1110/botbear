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
            let realchannel = channel;
            if (input[3]) {
                realchannel = input[3]
            }
            if (username === "botbear1110" || username === "ksyncbot") {
                return;
            }

            const lm = await got(`https://api.ivr.fi/logs/lastmessage/${realchannel}/${username}`).json();

            if (lm.status !== 404) {
                return `nymnDank ${lm.user}'s last message in #${realchannel} was: ${lm.response} - (${lm.time} ago)`
            }

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan : No logs for that user in this chat`;
        }
    }
}