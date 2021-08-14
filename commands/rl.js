const got = require("got");
const cc = require("../bot.js").cc;

module.exports = {
    name: "rl",
    execute: async (channel, user, input) => {
        try {
            let username = user.username;
            if (input[2]) {
                username = input[2];
            }

            const rl = await got(`https://api.ivr.fi/logs/rq/${channel}/${username}`).json();

            if (rl.status !== 404) {
                return `#${channel} ${rl.user}: ${rl.message} - (${rl.time} ago)`
            }

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan : No logs for that user in this chat`;
        }
    }
}