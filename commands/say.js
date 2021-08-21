const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js")
module.exports = {
    name: "say",
    ping: false,
    execute: async (channel, user, input) => {
        try {
            let userPermission = await tools.query(`SELECT * FROM Users WHERE username=?`, [user.username])
            userPermission = JSON.parse(userPermission[0].permission)

            input = input.splice(2)
            let msg = input.toString().replaceAll(',', ' ')

            if (channel === "forsen") {
                channel = "botbear1110"
            }

            if (userPermission < 2000 && msg.match(/^[$|/|.|?|!|-]|\bkb\b/g)) { // ignores $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
                return;
            }
            if (userPermission < 2000 /*&& channel !== "nymn"*/) {
                return;
            }
            const masspinged = await tools.massping(msg.toLowerCase())

            if (masspinged != "null") {
                return "[MASS PING]"
            }

            return msg;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}