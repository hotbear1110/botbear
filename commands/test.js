const cc = require("../bot.js").cc;

module.exports = {
    name: "test",
    ping: true,
    description: "This is just a dev command for testing purposes",
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            console.log(user.username)
            cc.whisper(user.username, "test")
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}