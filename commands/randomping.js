const axios = require('axios');

module.exports = {
    name: "randomping",
    ping: false,
    description: 'This command will make the bot ping a random user in chat.',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const randomuser = await axios.get(`https://decapi.me/twitch/random_user/${channel}`, {timeout: 10000});

            return `:tf: 🔔 ${randomuser.data}`;

        } catch (err) {
            console.log(err);
            if (err.name) {
                if (err.name === "TimeoutError") {
                    return `FeelsDankMan Banphrase api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error`;     
        }
    }
}