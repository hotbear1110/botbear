const tools = require("../tools/tools.js");
const cc = require("../bot.js").cc;
require('dotenv').config();
const got = require("got");

module.exports = {
    name: "test",
    ping: true,
    description: 'test',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let message = "This is a test    .   "
            console.log(`"${message}"`)
            message = tools.removeTrailingSpaces(message);
            console.log(message)
            return `"${message}"`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}