const cc = require("../bot.js").cc;
module.exports = {
    name: "say",
    execute: async (channel, user, input) => {
        try {
            let msg = input.toString();
            msg = msg.substring(7)
            msg = msg.toString().replaceAll(',', ' ')
            
            if (user.username != "hotbear1110") {
                return;
            }
            else {
                cc.say(`#${channel}`, msg)
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}