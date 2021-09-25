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
            let realcommand = input[0] + " " + input[2];
            realcommand = realcommand.toString().toLowerCase();
            console.log(realcommand);


            const Alias = new tools.Alias(realcommand);
            realcommand = realcommand.replace(Alias.getRegex(), Alias.getReplacement()).split(' ');
            console.log(realcommand);

            realcommand = realcommand[1];
            console.log(realcommand);

            if (realcommand === "ping" || realcommand === "delay")  {
                return;
            }

            const commands = requireDir("../commands");

            if (typeof commands[realcommand] === "undefined") {
                console.log("undefined");
                return;
            }

            let result = await commands[realcommand].execute(channel, user, realcommand, perm);


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