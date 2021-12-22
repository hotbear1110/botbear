const got = require("got");
const tools = require("../tools/tools.js");


module.exports = {
    name: "lm",
    ping: true,
    description: 'This command will give you the last logged line from a specific user in the chat (Only works if logs are available in the channel, logs used: "https://logs.ivr.fi/"). Example: "bb fl NymN"',
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
            if (username === "botbear1110" || username === "ksyncbot") {
                return;
            }

            const lm = await got(`https://api.ivr.fi/logs/lastmessage/${realchannel}/${username}`, { timeout: 10000 }).json();
            const masspinged = await tools.massping(lm.response.toLowerCase(), channel);

            if (masspinged != "null") {
                return "[MASS PING]";
            }

            let message = tools.splitLine(lm.response, 350)
            if (lm.status !== 404) {
                if (message[1]) {
                    return `#${realchannel} ${lm.user}: ${message}... - (${lm.time} ago)`;
                }
                return `nymnDank ${lm.user}'s last message in #${realchannel} was: ${lm.response} - (${lm.time} ago)`;
            }

        } catch (err) {
            console.log(err);
            if (err.name) {
                if (err.name === "TimeoutError") {
                    return `FeelsDankMan Banphrase api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error`;
        }
    }
}