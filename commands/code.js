const tools = require("../tools/tools.js");
const _ = require("underscore");

module.exports = {
    name: "code",
    ping: true,
    description: 'Gives the user a link to the source code of a given command',
    permission: 100,
    category: "Info Command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let commandList = await tools.query(`
                    SELECT *
                    FROM Commands`);

            let iscommand = false;

            _.each(commandList, function (commandName) {

                if (input[2] === commandName.Name) {
                    iscommand = true;
                    return;
                }

            });

            if (iscommand === false) {
                return `${input[2]} is not a command! Do: "bb commands" to see a list of available commands`
            }

            return `https://github.com/hotbear1110/botbear/blob/main/commands/${input[2]}.js`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}