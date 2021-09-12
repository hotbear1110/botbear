const axios = require('axios');

module.exports = {
    name: "randomping",
    ping: false,
    execute: async (channel, user, input, perm) => {
        try {
            if (perm < 1500) {
                return;
            }
            const randomuser = await axios.get(`https://decapi.me/twitch/random_user/${channel}`);

            return `:tf: 🔔 ${randomuser.data}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}