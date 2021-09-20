const axios = require('axios');

module.exports = {
    name: "randomping",
    ping: false,
    description: "Pings a random chatter",
    permission: 1500,
    execute: async (channel, user, input, perm) => {
        try {
            if (perm < 1500) {
                return;
            }
            const randomuser = await axios.get(`https://decapi.me/twitch/random_user/${channel}`, {timeout: 10000});

            return `:tf: 🔔 ${randomuser.data}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}