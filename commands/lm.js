const got = require("got");
const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js");


module.exports = {
    name: "lm",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                username = input[2];
            }
            let realchannel = channel;
            if (input[3]) {
                realchannel = input[3];
            }
            if (username === "botbear1110" || username === "ksyncbot") {
                return;
            }

            const lm = await got(`https://api.ivr.fi/logs/lastmessage/${realchannel}/${username}`).json();
            const masspinged = await tools.massping(lm.response.toLowerCase());

            if (masspinged != "null") {
                return "[MASS PING]";
            }
            if (lm.status !== 404) {
                return `nymnDank ${lm.user}'s last message in #${realchannel}ﾠwas: ${lm.response} - (${lm.time} ago)`;
            }

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan`;
        }
    }
}