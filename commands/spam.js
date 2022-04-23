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
            let message = input.slice();
            message.shift()
            message.shift()
            message.shift()

            message = message.toString().replaceAll(",", " ");

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