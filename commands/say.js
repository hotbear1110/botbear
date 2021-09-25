const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js");
const regex = require('../tools/regex.js');

module.exports = {
    name: "say",
    ping: false,
    description: "Reponds with whatever the input is (only works in nymn's chat)",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            input = input.splice(2);
            let msg = input.toString().replaceAll(',', ' ');

            if (channel === "forsen") {
                channel = "botbear1110";
            }

            msg.replace(regex.invisChar, '');


            if (user.mod === false && perm < 2000 && msg.match(/[$|/|.|?|!|-]|\bkb\b/g)) { // ignores $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
                return;
            }
            if (perm < 1500 && channel !== "nymn") {
                return;
            }
            const masspinged = await tools.massping(msg.toLowerCase(), channel);

            if (masspinged != "null") {
                return "[MASS PING]";
            }

            return msg;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}