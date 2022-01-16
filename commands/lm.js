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


            const lm = await got(`https://api.ivr.fi/logs/lastmessage/${realchannel}/${username}`, { timeout: 10000 }).json();

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
                    return `FeelsDankMan api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error`;
        }
    }
}