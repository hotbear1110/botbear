const cc = require("../bot.js").cc;
const got = require("got");

module.exports = {
    name: "test",
    ping: true,
    description: "This is just a dev command for testing purposes",
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const STV = await got(`https://api.7tv.app/v2/users/135186096/emotes`, {timeout: 10000}).json();

                STV_list = STV

                console.log(STV_list[0]["id"])

                if(!STV_list[0]["id"]) {
                    return;
                }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}