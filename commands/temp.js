const shell = require("child_process")

module.exports = {
    name: "uptime",
    ping: true,
    description: 'This command will tell you how long the bot has been live for',
    permission: 100,
    category: "Bot command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }

            const temp = shell.execSync("vcgencmd measure_temp")

            return `EZ ${temp}`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}