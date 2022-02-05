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
            let uid = user["user-id"];
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                uid = await got(`https://api.ivr.fi/twitch/resolve/${input[2]}`, { timeout: 10000 }).json();
                uid = uid.id;
            }
            let realchannel = channel;
            if (input[3]) {
                realchannel = input[3];
            }

            const lm = await got(`https://logs.ivr.fi/channel/${realchannel}/userid/${uid}?json&reverse`, { timeout: 10000 }).json();

            let message = tools.splitLine(lm.messages[0].text, 350)

            const timeago = new Date().getTime() - Date.parse(lm.messages[0].timestamp);

            if (lm.status !== 404) {
                if (message[1]) {
                    return `#${realchannel} ${lm.messages[0].displayName}: ${message[0]}... - (${tools.humanizeDuration(timeago)} ago)`;
                }
                return `nymnDank ${lm.messages[0].displayName}'s last message in #${realchannel[0]}\u{E0000}${realchannel.slice(1)} was: ${message} - (${tools.humanizeDuration(timeago)} ago)`;
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