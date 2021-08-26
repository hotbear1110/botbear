const got = require("got");
const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js")


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
            const masspinged = await tools.massping(lm.response.toLowerCase())

            if (masspinged != "null") {
                return "[MASS PING]"
            }
            if (lm.status !== 404) {
                return `nymnDank ${lm.user}'s last message in #${realchannel}ﾠwas: ${lm.response} - (${lm.time} ago)`
            }

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan : No logs for that user in this chat`;
        }
    }
}