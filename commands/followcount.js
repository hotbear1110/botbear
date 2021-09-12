const axios = require('axios');
const _ = require("underscore");
const tools = require("../tools/tools.js");


module.exports = {
    name: "followcount",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let realchannel = channel;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                realchannel = input[2];
            }

            const followcount = await axios.get(`https://decapi.me/twitch/followcount/${realchannel}`);

            if (followcount.data === 0) {
                return `Could not find the channel ${realchannel}`;
            }

            return `#${realchannel} has ${followcount.data} followers!`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}