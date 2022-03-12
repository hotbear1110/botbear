const _ = require("underscore");
const tools = require("../tools/tools.js");
var fs = require('fs');
const { res } = require("date-and-time");

module.exports = {
    name: "add",
    ping: true,
    description: 'Can add "features" to the bot. This to add: "bb add alias [command] [alias(es)]"',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            switch (input[2]) {
                case "alias":
                    let command = input[3];

                    const commandlist = await tools.query(`SELECT * FROM Commands WHERE Name=?`, [command]);

                    if (!commandlist.length) {
                        return `${command} is not a command`;
                    }
                    let aliases = input;
                    aliases.shift()
                    aliases.shift()
                    aliases.shift()
                    aliases.shift()

                    let data = await tools.query(`SELECT Aliases FROM Aliases`);

                    data = data[0].Aliases;

                    let newdata = data.toString().replaceAll("[", "").replaceAll("]", "").split(",");

                    let currentAliases = [];

                    _.each(newdata, function (alias) {
                        currentAliases.push(alias)
                    })

                    let alreadyAlias = [];

                    let addedAliases = [];

                    let iscommand = [];

                    result = await new Promise(async function (resolve) {
                        await _.each(aliases, async function (alias) {
                            const commandlist = await tools.query(`SELECT * FROM Commands WHERE Name=?`, [alias]);
                            if (commandlist.length) {
                                iscommand.push(alias);
                            } else {
                                _.each(newdata, function (oldalias) {
                                    if (oldalias[alias]) {
                                        alreadyAlias.push(alias)
                                    }
                                })
                                if (!alreadyAlias.includes(alias)) {
                                    newdata.push(`{
                                "${alias}": "${command}"
                            }`)
                                    addedAliases.push(alias)
                                }
                            }
                            if (alias === aliases[aliases.length - 1]) {
                                resolve([newdata, iscommand, alreadyAlias, addedAliases])
                            }
                        });
                    })

                    await tools.query(`UPDATE Aliases SET Aliases=?`, [`[${newdata.toString()}]`])

                    let iscommand2 = "";

                    if (result[1].length) {
                        iscommand2 = `- The follow aliases are command names: (${result[1].toString().replaceAll(",", ", ")})`
                    }

                    let alreadyAlias2 = "";

                    if (result[2].length) {
                        alreadyAlias2 = `- The follow aliases already exists: (${result[2].toString().replaceAll(",", ", ")})`

                    }

                    if (!result[3].length) {
                        return `${alreadyAlias2} ${iscommand2}`
                    }

                    return `Successfully added the aliases (${result[3].toString().replaceAll(",", ", ")}) to ${command}. ${alreadyAlias2} ${iscommand2}`
            }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}