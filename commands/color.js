const axios = require('axios');

module.exports = {
    name: "uid",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1)
                }
                username = input[2];
            }
            
            const userColor = await axios.get(`https://api.ivr.fi/twitch/resolve/${username}`);

            return `That user has the color: ${userColor.data.chatColor}`;
        } catch (err) {
            console.log(err);
            return `Error FeelsBadMan `;
        }
    }
}