const tools = require("../tools/tools.js");
const regex = require('../tools/regex.js');

module.exports = {
    name: "cum",
    ping: false,
    description: 'This command will make the bot cum in different ways. Example: "bb cum on NymN"',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            input.shift()
            input.shift()

            let msg = input.toString();
            msg = msg.replaceAll(",", " ")
            msg = msg.replaceAll(/(?:^|\W)me(?:$|\W)/g, " you ")
            msg = msg.replaceAll(/(?:^|\W)my(?:$|\W)/g, " your ")

            return `/me *feeds you my precum*`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}