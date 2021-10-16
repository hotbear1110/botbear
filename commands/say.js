const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js");
const regex = require('../tools/regex.js');

module.exports = {
    name: "say",
    ping: false,
    description: 'This command will let you make the bot say anything in chat. (The message gets checked for massping, banphrases etc.). Example: "bb say NymN is soy lole"',
    permission: 100,
    category: "Random command",
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