const axios = require('axios');
const _ = require("underscore");
const tools = require("../tools/tools.js");


module.exports = {
    name: "staffcheck",
    ping: true,
    description: 'This command will check if there is any Twitch staff in chat',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission> perm) {
                return;
            }
            let chatters = await axios.get(`https://tmi.twitch.tv/group/user/${channel}/chatters`, {timeout: 10000});
            chatters = chatters.data["chatters"];
            if (!chatters["staff"].length && !chatters["admins"].length && !chatters["global_mods"].length) {
                return `TriHard no staff in chat, we are safe!`
            } else {
            return `monkaS There is ${chatters["staff"].length + chatters["staff"].length + chatters["staff"].length} staff in chat rn.`;
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}