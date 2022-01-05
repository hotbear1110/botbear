const got = require("got");
const tools = require("../tools/tools.js");


module.exports = {
    name: "rl",
    ping: true,
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

            try {
                const optedout = await got(`https://logs.ivr.fi/channel/${realchannel}/user/${username}`, { timeout: 10000 });
            } catch (err) {
                if (err.toString().startsWith("HTTPError: Response code 403 (Forbidden)")) {
                    return "User or channel has opted out";
                }
                if (err.toString().startsWith("HTTPError: Response code 500 (Internal Server Error)")) {
                    return "Could not load logs. Most likely the user either doesn't exist or doesn't have any logs here.";
                }
                console.log(err)
            }

            const rl = await got(`https://api.ivr.fi/logs/rq/${realchannel}/${username}`, { timeout: 10000 }).json();
            const masspinged = await tools.massping(rl.message.toLowerCase(), channel);

            if (masspinged != "null") {
                return "[MASS PING]";
            }

            let message = tools.splitLine(rl.message, 350)
            if (rl.status !== 404) {
                if (message[1]) {
                    return `#${realchannel} ${rl.user}: ${message[0]}... - (${rl.time} ago)`;
                }
                return `#${realchannel} ${rl.user}: ${message} - (${rl.time} ago)`;
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