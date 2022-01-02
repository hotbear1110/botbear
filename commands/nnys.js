const tools = require("../tools/tools.js");

module.exports = {
    name: "nnys",
    ping: false,
    description: 'temp command',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                username = input[2];
            }
            let test = 1640887200000 - new Date().getTime();

            return `${username}, NymN's New Years Show starts at 7PM CET (In ${tools.humanizeDuration(test)})`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}