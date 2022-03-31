const got = require("got");

module.exports = {
    name: "color",
    ping: true,
    description: 'This command will give you the color name and hex of a given users username color. Example: "bb color NymN"',
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
                    input[2] = input[2].substring(1);
                }
                username = input[2];

            }
            let iscolor = false;
            if (input[2]) {
                if (input[2].startsWith("#")) {
                    iscolor = true;
                }
            }
            let color = "";
            if (iscolor === false) {
                let userColor = await got(`https://api.ivr.fi/twitch/resolve/${username}`, { timeout: 10000 }).json();

                color = userColor.chatColor;
            } else {
                color = input[2];
            }

            if (username === user.username) {
                color = user["color"];
            }

            const colorName = await got(`https://www.thecolorapi.com/id?hex=${color.replace('#', '')}`, { timeout: 10000 }).json();

            if (iscolor === true) {
                return `That hex is the color: ${colorName.name.value} ${color}`;
            }

            return `That user has the color: ${colorName.name.value} ${color}`;
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