const got = require("got");
const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js")


module.exports = {
    name: "fl",
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


            const fl = await got(`https://api.ivr.fi/logs/firstmessage/${realchannel}/${username}`).json();
            const masspinged = await tools.massping(fl.message.toLowerCase())

            if (masspinged != "null") {
                return "[MASS PING]"
            }
            if (fl.status !== 404) {
                return `nymnDank ${fl.user}'s first message in #${realchannel} was: ${fl.message} - (${fl.time} ago)`
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan : No logs for that user in this chat`;
        }
    }
}