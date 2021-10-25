const axios = require('axios');
require('dotenv').config();

module.exports = {
    name: "uid",
    ping: true,
    description: 'This command will give you the user-id of a specified user. Example: "bb uid NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let uiduser = user.username;

            let isuid = !isNaN(input[2]);

            if (input[2]) {
                if (isuid) {
                    try {
                        const userData = await axios.get(`https://api.twitch.tv/helix/users?id=${input[2]}`, {
                            headers: {
                                'client-id': process.env.TWITCH_CLIENTID,
                                'Authorization': process.env.TWITCH_AUTH
                            },
                            timeout: 10000
                        })
                        if (userData.data.data.length) {
                        uiduser = userData.data.data[0];
                        uiduser = uiduser["login"];

                }
            } catch (err) {
                console.log(err);
                return `FeelsDankMan Error: ${err.response.data.error}`;

            }
        } else {
            if (input[2].startsWith("@")) {
                input[2] = input[2].substring(1);
            }
            uiduser = input[2];
        }
    }
            const userID = await axios.get(`https://api.ivr.fi/twitch/resolve/${uiduser}`, {timeout: 10000});

            if (isuid) {
                if (userID.data.banned === true) {
                    return `${uiduser} - cmonBruh [BANNED USER]`;
                }
    
                return uiduser;
            } else {
                if (userID.data.banned === true) {
                    return `${userID.data.id} - cmonBruh [BANNED USER]`;
                }
    
                return userID.data.id;
            }
        } catch (err) {
            console.log(err);
            if (err.name === "TimeoutError") {
                return `FeelsDankMan Banphrase api error: ${err.name}`;
            }
            return `FeelsDankMan Error: ${err.response.data.error}`;   
        }
    }
}