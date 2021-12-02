const uptime = require("../bot.js").uptime;
const tools = require("../tools/tools.js");
const shell = require("child_process")


module.exports = {
    name: "uptime",
    ping: true,
    description: 'This command will tell you how long the bot has been live for',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let now = new Date().getTime();

            let ms =  now - uptime;

            const commitCount = shell.execSync("git rev-list --all --count")

            return `Uptime: ${tools.humanizeDuration(ms)} - commit: ${commitCount}`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}