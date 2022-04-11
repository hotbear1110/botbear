const got = require("got");
const _ = require("underscore");
const tools = require("../tools/tools.js");


module.exports = {
    name: "latestmod",
    ping: true,
    description: 'This command will tell you if a given user is a mod in a given channel. And for how long. Example: "bb modcheck Fawcan NymN"(this will check Fawcan´s mod status in Nymn´s channel)',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let realchannel = channel;
            if (input[2]) {
                realchannel = input[2];
            }
            let modcheck = await got(`https://api.ivr.fi/twitch/modsvips/${realchannel}`, { timeout: 10000 }).json();
            let mods = modcheck["mods"];

            let ms = new Date().getTime() - Date.parse(mods[mods.length - 1].grantedAt)
            return `The newest M OMEGALUL D in #${realchannel[0]}\u{E0000}${realchannel.slice(1)} is ${mods[mods.length - 1].displayName}, they were added ${tools.humanizeDuration(ms)} ago.`;

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