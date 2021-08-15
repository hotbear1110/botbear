const axios = require('axios');

module.exports = {
    name: "uid",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            let uiduser = user.username;
            if (input[2]) {
                uiduser = input[2]
            }
            
                let userID = await axios.get(`https://api.ivr.fi/twitch/resolve/${uiduser}`)
                uid = userID.data.id

                return uid
            
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}