const shell = require("child_process")
const tools = require("../tools/tools.js");
const _ = require("underscore");
const { fchown } = require("fs");
const got = require("got");
const { indexOf } = require("underscore");
let messageHandler = require("../tools/messageHandler.js").messageHandler;

module.exports = {
    name: "test2",
    ping: true,
    description: 'This is a dev command for testing purposes',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let arraytest = ["nymn", "yabbe", "forsen", "xqcow"]
            input = input.splice(2);
            input.unshift("filler")
            console.log(input.toString())
            input = input.toString().replace(/(^|[@#.,:;\s]+)|([?!.,:;\s]|$)/gm, " ");
            input = input.split(" ");
            input = input.filter(String);
            console.log(input)
            const test = await tools.query(`SELECT username FROM Users WHERE ` + Array(input.length).fill("username = ?").join(" OR "), input);

            let result = test.map(a => a.username);

            let intersection = result.concat(arraytest.filter(x => !result.includes(x)));


            console.log(intersection)
            console.log(test)
            return;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Test Failed`;
        }
    }
}
