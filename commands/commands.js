const tools = require("../tools/tools.js");
const _ = require("underscore");

module.exports = {
    name: "commands",
    ping: true,
    description: 'This command will give you a link to the bot´s commands. You can add "local" to the end of the command, to see the commands enabled in the chat.',
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            if (input[2]) {
                if (input[2] === "local") {
                    let disabledList = await tools.query(`
                        SELECT disabled_commands
                        FROM Streamers
                        WHERE username=?`,
                        [channel]);

                    disabledList = JSON.parse(disabledList[0].disabled_commands);

                    if (!disabledList.length) {
                        return `This channel has all commands enabled: https://hotbear.xyz/`;
                    }

                    let commandList = await tools.query(`
                    SELECT *
                    FROM Commands`);

                    let isdisabled = false;

                    let commandsListNames = [];

                    _.each(commandList, function (command) {
                        commandsListNames.push(command.Name.toLowerCase());
                    });

                    _.each(disabledList, function (commandName) {
                        commandsListNames.splice(commandsListNames.indexOf(commandName), 1);
                    });

                    commandsListNames = commandsListNames.toString().replaceAll(",", "\n")

                    let hastebinlist = await tools.makehastebin(`List of enabled commands in #${channel}:\n\n${commandsListNames}`);

                    return `Local command list: ${hastebinlist}.txt`;

                }
            }
            return `List of commands: https://hotbear.xyz/`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}