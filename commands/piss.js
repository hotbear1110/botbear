const tools = require("../tools/tools.js");
const regex = require('../tools/regex.js');

module.exports = {
    name: "piss",
    ping: false,
    description: 'This command will make the bot piss in different ways. Example: "bb piss on NymN"',
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

            return `/me I pissed ${msg}`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}
