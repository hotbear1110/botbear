const axios = require('axios');
const _ = require("underscore");
const tools = require("../tools/tools.js");


module.exports = {
    name: "emotecheck",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {

            const emotecheck = await axios.get(`https://api.ivr.fi/twitch/emotes/${input[2]}`);

            if (emotecheck.data["status"] = 200) {
                let emotechannel = emotecheck.data["channel"]
                let tier = emotecheck.data["tier"]
                let url = emotecheck.data["emoteurl_3x"]

                return `${input[2]} is a tier ${tier} emote, from the channel (#${emotechannel}) - ${url}`;
            }
            
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan - Emote was not found`;
        }
    }
}