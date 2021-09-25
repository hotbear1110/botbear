const requireDir = require("require-dir");
const tools = require("../tools/tools.js");

module.exports = {
    name: "delay",
    ping: true,
    description: "Test the delay of commands",
    permission: 2000,
    showDelay: true,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }

            const Alias = new tools.Alias(input[2]);
            input[2] = input[2].replace(Alias.getRegex(), Alias.getReplacement()).split(' ');

            if (input[2] === "ping" || input[2] === "delay")  {
                return;
            }

            const commands = requireDir("../commands");

            if (typeof commands[input[2]] === "undefined") {
                console.log("undefined");
                return;
            }

            let result = await commands[input[2]].execute(channel, user, input, perm);


            if (!result) {
                return;
            }

            return result;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}