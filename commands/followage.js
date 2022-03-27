const got = require("got");
const _ = require("underscore");
const tools = require("../tools/tools.js");


module.exports = {
    name: "followage",
    ping: false,
    description: 'This command will give you the time a given user has followed a given channel. Example: "bb followage HotBear1110 NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let chatters = await got(`https://tmi.twitch.tv/group/user/${channel}/chatters`, { timeout: 10000 }).json();

            let chatterlist = [];
            chatters = chatters["chatters"];
            chatterlist = chatterlist.concat(chatters["broadcaster"]);
            chatterlist = chatterlist.concat(chatters["vips"]);
            chatterlist = chatterlist.concat(chatters["moderators"]);
            chatterlist = chatterlist.concat(chatters["staff"]);
            chatterlist = chatterlist.concat(chatters["admins"]);
            chatterlist = chatterlist.concat(chatters["global_mods"]);
            chatterlist = chatterlist.concat(chatters["viewers"]);

            let number = Math.floor(Math.random() * chatterlist.length);

            let username = chatterlist[number];
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    username = input[2].substring(1);
                } else {
                    username = input[2];
                }
            }
            let realchannel = channel;
            if (input[3]) {
                if (input[3].startsWith("@")) {
                    realchannel = input[3].substring(1);
                } else {
                    realchannel = input[3];
                }
            }

            const followcheck = await got(`https://api.ivr.fi/twitch/subage/${username}/${realchannel}`, { timeout: 10000 }).json();

            if (followcheck["followedAt"]) {
                const ms = new Date().getTime() - Date.parse(followcheck["followedAt"]);
                return `${user.username} has been following #${realchannel} for (${tools.humanizeDuration(ms)})`;
            }
            return `${user.username} does not follow #${realchannel}.`;
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