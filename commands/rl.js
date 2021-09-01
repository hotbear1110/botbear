const got = require("got");
const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js")


module.exports = {
    name: "rl",
    ping: false,
    execute: async (channel, user, input, perm) => {
        try {
            let username = user.username;
            if (input[2]) {
                username = input[2];
            }
            let realchannel = channel;
            if (input[3]) {
                realchannel = input[3]
            }

            const rl = await got(`https://api.ivr.fi/logs/rq/${realchannel}/${username}`).json();
            const masspinged = await tools.massping(rl.message.toLowerCase())

            if (masspinged != "null") {
                return "[MASS PING]"
            }
            if (rl.status !== 404) {
                return `#${realchannel}ﾠ ${rl.user}: ${rl.message} - (${rl.time} ago)`
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan`;
        }
    }
}