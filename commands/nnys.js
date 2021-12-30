const tools = require("../tools/tools.js");

module.exports = {
    name: "nnys",
    ping: true,
    description: 'temp command',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let test = 1640887200000 - new Date().getTime();

            return `Time untill nnys starts: ${tools.humanizeDuration(test)}`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}