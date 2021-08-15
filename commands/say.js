const cc = require("../bot.js").cc;
const tools = require("../tools/tools.js")
module.exports = {
    name: "say",
    ping: false,
    execute: async (channel, user, input) => {
        try {
            input = input.splice(2)
            let msg = input.toString().replaceAll(',', ' ')

            if (channel === "forsen") {
                channel = "botbear1110"
            }

            if (user.username != "hotbear1110") {
                return;
            }
            else {
                return msg;
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}