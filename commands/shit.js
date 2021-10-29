const tools = require("../tools/tools.js");
const regex = require('../tools/regex.js');

module.exports = {
    name: "shit",
    ping: false,
    description: 'This command will make the bot shit in different ways. Example: "bb shit on NymN"',
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

            const masspinged = await tools.massping(msg.toLowerCase(), channel);

            if (masspinged != "null") {
                return "[MASS PING]";
            }

            return `/me I shat ${msg}`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;        
        }
    }
}
