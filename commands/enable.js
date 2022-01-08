require('dotenv').config();
const tools = require("../tools/tools.js");
const _ = require("underscore");

module.exports = {
    name: "enable",
    ping: true,
    description: 'This command will let you enable different commands in your own chat or a chat you are mod in',
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            if (!user.mod && channel !== user.username && user['user-id'] != process.env.TWITCH_OWNERUID) {
                return;
            }
            switch (input[2]) {
                case "command":
                    if (!input[3]) {
                        return `Please specify a command to enable`;
                    }

                    let command = input[3];

                    let disabledList = await tools.query(`
                    SELECT disabled_commands
                    FROM Streamers
                    WHERE username=?`,
                        [channel]);

                    disabledList = JSON.parse(disabledList[0].disabled_commands);

                    console.log(disabledList);


                    if (!disabledList.includes(command)) {
                        return "That command is not disabled";
                    }

                    disabledList.splice(disabledList.indexOf(command), 1);

                    disabledList = JSON.stringify(disabledList);


                    tools.query(`UPDATE Streamers SET disabled_commands=? WHERE username=?`, [disabledList, channel]);

                    return `${command} is now enabled :)`;

                    break;

                case "category":
                    if (!input[3]) {
                        return `Please specify a category to enable`;
                    }

                    let category = input[3];

                    if (category === "core") {
                        return `Core commands can't be disabled, so there is no enabling them`;
                    }

                    let disabledList2 = await tools.query(`
                    SELECT disabled_commands
                    FROM Streamers
                    WHERE username=?`,
                        [channel]);

                    disabledList2 = JSON.parse(disabledList2[0].disabled_commands);

                    let commandList2 = await tools.query(`
                    SELECT *
                    FROM Commands`);

                    let iscategory = false;
                    let isdisabled = false;

                    _.each(commandList2, function (commandName) {

                        if (commandName.Category === `${category} command`) {
                            iscategory = true;
                            if (disabledList2.includes(commandName.Name)) {
                                isdisabled = true;
                                disabledList2.splice(disabledList2.indexOf(commandName.Name), 1);
                            }
                        }
                    });

                    if (iscategory === false) {
                        return `${category} is not a category! Do: "bb commands" to see a list of available category`
                    }

                    if (isdisabled === false) {
                        return `All ${category} commands are already enabled!`
                    }

                    disabledList2 = JSON.stringify(disabledList2);


                    tools.query(`UPDATE Streamers SET disabled_commands=? WHERE username=?`, [disabledList2, channel]);

                    return `All ${category} commands are now enabled :)`;
                    break;

                case "all":
                    let disabledList3 = await tools.query(`
                    SELECT disabled_commands
                    FROM Streamers
                    WHERE username=?`,
                        [channel]);

                    disabledList3 = JSON.parse(disabledList3[0].disabled_commands);

                    let commandList3 = await tools.query(`
                    SELECT *
                    FROM Commands`);

                    let isdisabled3 = false;

                    _.each(commandList3, function (commandName) {
                        if (commandName.Category !== "Core command" && commandName.Category !== "Dev command") {
                            if (disabledList3.includes(commandName.Name)) {
                                isdisabled3 = true;
                                disabledList3.splice(disabledList3.indexOf(commandName.Name), 1);
                            }
                        }

                    });

                    if (isdisabled3 === false) {
                        return `All commands are already enabled`
                    }

                    disabledList3 = JSON.stringify(disabledList3);


                    tools.query(`UPDATE Streamers SET disabled_commands=? WHERE username=?`, [disabledList3, channel]);

                    return `All commands are now enabled :)`;
                    break;


                default:
                    return 'Please specify if you want to enable: command, category or all.';
            }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}