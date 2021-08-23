const axios = require('axios');
const _ = require("underscore")
const tools = require("../tools/tools.js");


module.exports = {
    name: "modcheck",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            let chatters = await axios.get(`http://tmi.twitch.tv/group/user/${channel}/chatters`)
            chattercount = chatters.data["chatter_count"]
            return `There are ${chattercount} users in chat rn :O`
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}