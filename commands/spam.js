const cc = require("../bot.js").cc;

module.exports = {
    name: "spam",
    ping: true,
    description: 'spam something',
    permission: 100,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let message = input;
            message = message.toString()
            message.shift()
            message.shift()

            for (let i = 0; i < input[2]; i++) {
                cc.say(channel, message);
            }

            return;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}