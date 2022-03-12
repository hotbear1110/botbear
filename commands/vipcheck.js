const got = require("got");
const _ = require("underscore");
const tools = require("../tools/tools.js");

module.exports = {
    name: "vipcheck",
    ping: true,
    description: 'This command will tell you if a given user is a vip in a given channel. And for how long. Example: "bb vipcheck HotBear1110 NymN"(this will check HotBear1110´s vip status in Nymn´s channel)',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                username = input[2].toLowerCase();
            }
            let realchannel = channel;
            if (input[3]) {
                realchannel = input[3];
            }
            let vipcheck = await got(`https://api.ivr.fi/twitch/modsvips/${realchannel}`, { timeout: 10000 }).json();
            isvip = vipcheck["vips"];
            let vipresponse = "";

            await _.each(isvip, async function (viptatus) {
                if (viptatus.login == username) {
                    let vipdate = viptatus.grantedAt;
                    const ms = new Date().getTime() - Date.parse(vipdate);
                    vipresponse = `that user has been a vip😬 in #${realchannel} for - (${tools.humanizeDuration(ms)})`;
                }
            })

            if (vipresponse != "") {
                return vipresponse;
            }
            return `That user is not a vip in #${realchannel} :) `;
        } catch (err) {
            console.log(err);
            if (err.name === "TimeoutError") {
                return `FeelsDankMan api error: ${err.name}`;
            }
            return `FeelsDankMan Error`;
        }
    }
}