require('dotenv').config();
const tools = require("../tools/tools.js");
const axios = require('axios');

module.exports = {
    name: "accage",
    ping: true,
    description: "Responds with the age of the account",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (this.permission > perm) {
                return;
            }
            let uid = user["user-id"];

            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                let username = input[2];

                uid = await axios.get(`https://api.ivr.fi/twitch/resolve/${username}`, {timeout: 10000});
                uid = uid.data.id;
            }

            let twitchdata = await axios.get(`https://api.twitch.tv/helix/users?id=${uid}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
                timeout: 10000
            })

            const ms = new Date().getTime() - Date.parse(twitchdata.data.data[0].created_at);

            return `Account is ${tools.humanizeDuration(ms)} old`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}