const axios = require('axios');
const _ = require("underscore")
const tools = require("../tools/tools.js");


module.exports = {
    name: "modcheck",
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
            let realchannel = channel;
            if (input[3]) {
                realchannel = input[3]
            }
            let modcheck = await axios.get(`https://api.ivr.fi/twitch/modsvips/${realchannel}`)
            ismod = modcheck.data["mods"]
            let modresponse = ""
            await _.each(ismod, async function (modstatus) {
                if (modstatus.login == username) {
                    let moddate = modstatus.grantedAt
                    const ms = new Date().getTime() - Date.parse(moddate);
                    modresponse = `that user has been a M OMEGALUL D in #${realchannel} for - (${tools.humanizeDuration(ms)})`
                }
            })
            if (modresponse != "") {
                return modresponse
            }
            else {
                return `That user is not a mod in #${realchannel} :)`
            }

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}