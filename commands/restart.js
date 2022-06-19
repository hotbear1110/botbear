let messageHandler = require("../tools/messageHandler.js").messageHandler;
const shell = require("child_process")

module.exports = {
    name: "restart",
    ping: false,
    description: 'restarts botbear',
    permission: 2000,
    cooldown: 3, //in seconds
    category: "Dev command",
    execute: async (channel, user, input, perm, aliascommand) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            Promise.all([await new messageHandler(channel, "ppCircle restarting...", true).newMessage()]);

            shell.execSync("sudo reboot")
            return;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}