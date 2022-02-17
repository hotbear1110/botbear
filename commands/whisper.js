let whisperHandler = require("../tools/whisperHandler.js").whisperHandler;

module.exports = {
    name: "whisper",
    ping: false,
    description: 'This command makes the bot whisper a user',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }

            let message = input.slice();
            message.shift();
            message.shift()
            message.shift()
            message = message.toString().replaceAll(",", " ");

            new whisperHandler(input[2], message).newWhisper();

            return;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}