const axios = require('axios');

module.exports = {
    name: "uid",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let uiduser = user.username;
            if (input[2]) {
                uiduser = input[2]
            }
            
            const userID = await axios.get(`https://api.ivr.fi/twitch/resolve/${uiduser}`);

            if (userID.data.banned === true) {
                return `${userID.data.id} - cmonBruh [BANNED USER]`
            }

            return userID.data.id;
        } catch (err) {
            console.log(err);
            return `Error FeelsBadMan `;
        }
    }
}