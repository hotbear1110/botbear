const got = require("got");
const tools = require("../tools/tools.js");


module.exports = {
    name: "fl",
    ping: false,
    description: 'This command will give you the first logged line from a specific user in the chat (Only works if logs are available in the channel, logs used: "https://logs.ivr.fi/"). Example: "bb fl NymN"',
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


            const fl = await got(`https://api.ivr.fi/logs/firstmessage/${realchannel}/${username}`, {timeout: 10000}).json();
            const masspinged = await tools.massping(fl.message.toLowerCase(), channel);

            if (masspinged != "null") {
                return "[MASS PING]";
            }

            let message = tools.splitLine(fl.message, 350)
            if (fl.status !== 404) {
                if (message[1]) {
                    return `#${realchannel} ${fl.user}: ${message}... - (${fl.time} ago)`;
                }
                return `nymnDank ${fl.user}'s first message in #${realchannel} was: ${fl.message} - (${fl.time} ago)`;
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