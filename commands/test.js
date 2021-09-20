const cc = require("../bot.js").cc;

module.exports = {
    name: "test",
    ping: true,
    description: "A test command for testing new features, before making a deticated command",
    permission: 2000,
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