const got = require("got");
const tools = require("../tools/tools.js");


module.exports = {
    name: "rl",
    ping: false,
    description: 'This command will give you a random logged line from either a random user or a specified user in the chat (Only works if logs are available in the channel, logs used: "https://logs.ivr.fi/"). Example: "bb rl NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let uid = user["user-id"];

            const rl = await got(`https://logs.ivr.fi/channel/${channel}/userid/${uid}/random?json`, { timeout: 10000 }).json();

            let message = tools.splitLine(rl.messages[0].text, 350)

            const timeago = new Date().getTime() - Date.parse(rl.messages[0].timestamp);

            if (rl.status !== 404) {
                if (message[1]) {
                    return `#${channel} ${rl.messages[0].displayName}: ${message[0]}... - (${tools.humanizeDuration(timeago)} ago)`;
                }
                return `#${channel[0]}\u{E0000}${channel.slice(1)} ${rl.messages[0].displayName}: ${message} - (${tools.humanizeDuration(timeago)} ago)`;
            }

        } catch (err) {
            console.log(err);
            if (err.toString().startsWith("HTTPError: Response code 403 (Forbidden)")) {
                return "User or channel has opted out";
            }
            if (err.toString().startsWith("HTTPError: Response code 500 (Internal Server Error)")) {
                return "Could not load logs. Most likely the user either doesn't exist or doesn't have any logs here.";
            }
            if (err.name) {
                if (err.name === "HTTPError") {
                    return "That user does not exist";
                }
                return `FeelsDankMan api error: ${err.name}`;
            }
            return `FeelsDankMan Error`;
        }
    }
}