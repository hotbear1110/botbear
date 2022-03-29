let messageHandler = require("../tools/messageHandler.js").messageHandler;
const shell = require("child_process")

module.exports = {
    name: "reboot",
    ping: false,
    description: 'reboots the bot',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            new messageHandler(`#${channel}`, `FeelsDankMan rebooting...`).newMessage();

            shell.execSync("sudo reboot")

            return;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}