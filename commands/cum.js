const tools = require("../tools/tools.js");
const regex = require('../tools/regex.js');

module.exports = {
    name: "cum",
    ping: false,
    description: "Responds 'I came'",
    permission: 100,
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

            return `I came ${msg}`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}