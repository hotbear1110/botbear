const tools = require("../tools/tools.js");
const cc = require("../bot.js").cc;

module.exports = {
    name: "test2",
    ping: true,
    description: 'test',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            cc.ban(channel, input[2], "test")
                .then((data) => {
                    console.log(data)
                }).catch((err) => {
                    console.log(err)
                })

            return "monkaS ok."
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}