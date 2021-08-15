const got = require("got");
const cc = require("../bot.js").cc;

module.exports = {
    name: "fl",
    ping: false,
    execute: async (channel, user, input) => {
        try {
            let username = user.username;
            if (input[2]) {
                username = input[2];
            }

            const fl = await got(`https://api.ivr.fi/logs/firstmessage/${channel}/${username}`).json();

            if (fl.status !== 404) {
                cc.say(`#${channel}`, `nymnDank ${fl.user}'s first message here was: ${fl.message} - (${fl.time} ago)`)
            }

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan : No logs for that user in this chat`;
        }
    }
}