require('dotenv').config();
const tools = require("../tools/tools.js");
const got = require("got");

module.exports = {
    name: "accage",
    ping: true,
    description: 'This command will tell you the specified users account age. Example: "bb accage NymN"',
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

            let uid = await got(`https://api.ivr.fi/twitch/resolve/${chatterlist[number]}`, { timeout: 10000 }).json();
            uid = uid.id;

            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                let username = input[2];

                uid = await got(`https://api.ivr.fi/twitch/resolve/${username}`, { timeout: 10000 }).json();
                uid = uid.id;
            }

            let twitchdata = await got(`https://api.twitch.tv/helix/users?id=${uid}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
                timeout: 10000
            }).json();

            const ms = new Date().getTime() - Date.parse(twitchdata.data[0].created_at);

            return `Account is ${tools.humanizeDuration(ms)} old`;

        } catch (err) {
            console.log(err);
            if (err.name) {
                if (err.name === "TimeoutError") {
                    return `FeelsDankMan api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error: ${err.response.data.error}`;
        }
    }
}