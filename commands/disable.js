require('dotenv').config();
const tools = require("../tools/tools.js");
const _ = require("underscore");

module.exports = {
    name: "disable",
    ping: true,
    description: 'This command will let you disable different commands in your own chat or a chat you are mod in',
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
                        return `Please specify a command to disable`;
                    }

                    let command = input[3].toLowerCase();

                    let disabledList = await tools.query(`
                    SELECT disabled_commands
                    FROM Streamers
                    WHERE username=?`,
                            [channel]);

                        disabledList = JSON.parse(disabledList[0].disabled_commands);
    
                        if (disabledList.includes(command)) {
                            return "That command is already disabled :)";
                        }

                        let commandList = await tools.query(`
                    SELECT *
                    FROM Commands`);

                    let iscommand = false;
                    let iscore = false;

                        _.each(commandList, function (commandName) {

                            if (command === commandName.Name.toLowerCase()) {
                                if (commandName.Category === "Core command" || commandName.Category === "Dev command") {
                                    iscore = true;
                                    return;
                                }
                                iscommand = true;
                                return;
                            }

                        });

                        if (iscore === true) {
                            return `${command} is a "Core command" and you cannot disable it. For a list of commands do: "bb commands"`;
                        }

                        if (iscommand === false) {
                            return `${command} is not a command! Do: "bb commands" to see a list of available commands`
                        }

                        disabledList.push(command);
                        console.log(disabledList);

                        disabledList = JSON.stringify(disabledList);


                        tools.query(`UPDATE Streamers SET disabled_commands=? WHERE username=?`, [disabledList, channel]);

                        return `${command} is now disabled :)`;

                break;

                case "category":
                    if (!input[3]) {
                        return `Please specify a category to disable`;
                    }

                    let category = input[3].toLowerCase();

                    if (category === "core") {
                        return `You can't disable core commands`;
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

                                if (commandName.Category.toLowerCase() === `${category} command`) {
                                    iscategory = true;
                                    if (!disabledList2.includes(commandName.Name.toLowerCase())) {
                                    isdisabled = true;
                                    disabledList2.push(commandName.Name.toLowerCase());
                                    }
                                }

                        });

                        if (iscategory === false) {
                            return `${category} is not a category! Do: "bb commands" to see a list of available category`
                        }

                        if (isdisabled === false) {
                            return `All ${category} commands are already disabled!`
                        }

                        disabledList2 = JSON.stringify(disabledList2);


                        tools.query(`UPDATE Streamers SET disabled_commands=? WHERE username=?`, [disabledList2, channel]);

                        return `All ${category} commands are now disabled :)`;
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
                                    if (!disabledList3.includes(commandName.Name.toLowerCase())) {
                                    isdisabled3 = true;
                                    disabledList3.push(commandName.Name.toLowerCase());
                                    }
                                }

                        });

                        if (isdisabled3 === false) {
                            return `All commands are already disabled`
                        }

                        disabledList3 = JSON.stringify(disabledList3);


                        tools.query(`UPDATE Streamers SET disabled_commands=? WHERE username=?`, [disabledList3, channel]);

                        return `All commands are now disabled :)`;
                break;


                    default:
                        return 'Please specify if you want to disable: command, category or all. ("disable all" exludes core commands)';
                }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}