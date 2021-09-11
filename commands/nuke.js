const cc = require("../bot.js").cc;

module.exports = {
    name: "bot",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            if (cc.mod && cc.isMod(`#${channel}`, "botbear1110")) {
                client.ban(channel, input[1]);

                return `Nuked :)`
            }
            else {
                return;
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}