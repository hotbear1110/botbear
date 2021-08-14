const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js")
module.exports = {
    name: "say",
    execute: async (channel, user, input) => {
        try {
            input = input.splice(2)
            let msg = input.toString().replaceAll(',', ' ')

            if (user.username != "hotbear1110") {
                return;
            }
            else {
                const banPhrase = await tools.banphrasePass(msg, channel);

                if (banPhrase.banned) {
                    cc.say(channel, `[Banphrased] cmonBruh `);
                    return;
                }
                cc.say(`#${channel}`, msg)
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}