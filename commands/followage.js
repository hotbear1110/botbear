const axios = require('axios');
const _ = require("underscore")
const tools = require("../tools/tools.js");


module.exports = {
    name: "followage",
    ping: false,
    execute: async (channel, user, input) => {
        try {
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1)
                }
                username = input[2];
            }
            let followcheck = await axios.get(`https://api.ivr.fi/twitch/subage/${username}/${channel}`)
            if(followcheck.data["followedAt"]) {
                const ms = new Date().getTime() - Date.parse(followcheck.data["followedAt"]);
                return `${username} has been following #${channel} for (${tools.humanizeDuration(ms)})`
            }
            else {
                return `${username} does not follow #${channel}.`
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}