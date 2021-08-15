const axios = require('axios');
const _ = require("underscore")

module.exports = {
    name: "modcheck",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1)
                }
                username = input[2];
            }
            let modcheck = await axios.get(`https://api.ivr.fi/twitch/modsvips/${channel}`)
            ismod = modcheck.data["mods"]
            let modresponse = ""
            await _.each(ismod, async function (modstatus) {
                if (modstatus.login == username) {
                    let moddate = modstatus.grantedAt
                    modresponse = `that user has been a M OMEGALUL D since - (${moddate.substring(0, 10) })`
                }
            })
            if (modresponse != "") {
                return modresponse
            }
            else {
                return `That user is not a mod :)`
            }

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}