const axios = require('axios');
const _ = require("underscore")
const tools = require("../tools/tools.js");

module.exports = {
    name: "vipcheck",
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
            let vipcheck = await axios.get(`https://api.ivr.fi/twitch/modsvips/${realchannel}`)
            isvip = vipcheck.data["vips"]
            let vipresponse = ""

            await _.each(isvip, async function (viptatus) {
                if (viptatus.login == username) {
                    let vipdate = viptatus.grantedAt
                    const ms = new Date().getTime() - Date.parse(vipdate);
                    vipresponse = `that user has been a vip😬 in #${realchannel} for - (${tools.humanizeDuration(ms)})`
                }
            })

            if (vipresponse != "") {
                return vipresponse
            }
            return `That user is not a vip in #${realchannel} :) `
        } catch (err) {
            console.log(err);
            return `Error FeelsBadMan`
        }
    }
}