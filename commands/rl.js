const got = require("got");
const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js");


module.exports = {
    name: "rl",
    ping: false,
    description: 'This command will give you a random logged line from a specific user in the chat (Only works if logs are available in the channel, logs used: "https://logs.ivr.fi/"). Example: "bb rl NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
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
                return `#${realchannel} ${rl.user}: ${rl.message} - (${rl.time} ago)`;
            }
        } catch (err) {
            console.log(err);
            if (err.name) {
                return `FeelsDankMan Banphrase api error: ${err.name}`;
            }
            return `FeelsDankMan Error`;
    }
    }
}