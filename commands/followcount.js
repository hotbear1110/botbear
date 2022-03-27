const got = require("got");

module.exports = {
    name: "followcount",
    ping: true,
    description: 'This command will give you the amount of followers a specified channel has. Example: "bb followcount NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let realchannel = channel;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                realchannel = input[2];
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

            const followcount = await got(`https://decapi.me/twitch/followcount/${chatterlist[number]}`, { timeout: 10000 }).json();

            if (followcount === 0) {
                return `Could not find the channel ${realchannel}`;
            }

            return `#${realchannel} has ${followcount} followers!`;

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