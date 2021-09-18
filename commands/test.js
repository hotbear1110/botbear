const cc = require("../bot.js").cc;

module.exports = {
    name: "test",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            console.log(user.username)
            cc.whisper(user.username, "test")
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}