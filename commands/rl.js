const got = require("got");
const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js");


module.exports = {
    name: "rl",
    ping: false,
    description: "Responds with a random line from a given user",
    permission: 100,
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

            const rl = await got(`https://api.ivr.fi/logs/rq/${realchannel}/${username}`, {timeout: 10000}).json();
            const masspinged = await tools.massping(rl.message.toLowerCase(), channel);

            if (masspinged != "null") {
                return "[MASS PING]";
            }
            if (rl.status !== 404) {
                return `#${realchannel}ﾠ ${rl.user}: ${rl.message} - (${rl.time} ago)`;
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan`;
        }
    }
}