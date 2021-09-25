const axios = require('axios');

module.exports = {
    name: "uid",
    ping: true,
    description: "Reponds with the user id of a given user",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let uiduser = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                uiduser = input[2];
            }
            
            const userID = await axios.get(`https://api.ivr.fi/twitch/resolve/${uiduser}`, {timeout: 10000});

            if (userID.data.banned === true) {
                return `${userID.data.id} - cmonBruh [BANNED USER]`;
            }

            return userID.data.id;
        } catch (err) {
            console.log(err);
            return `Error FeelsBadMan `;
        }
    }
}