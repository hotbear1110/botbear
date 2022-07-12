const { resolve } = require("node:path");
const fs = require("node:fs");
const sql = require("./../sql/index.js");

module.exports = {
    Find: (path) => {
        const commands = [];
        const dir = fs.readdirSync(path, { withFileTypes: true });
        for (const file of dir) {
            if (file.isFile()) {
                if (file.name === "index.js") continue;

                const name = resolve(
                    path,
                    file.name
                );

                const res = require(name);
                commands.push(res);
            }
        }
        return commands;
    },
    Load: async function () {
        const commands = this.Find(__dirname);
        const dbCommands = await sql.Query(`SELECT * FROM Commands`);
        const disableCommand = await sql.Query(`SELECT username FROM Streamers WHERE command_default = ?`, [1]);

        // TODO Melon: This could look better.
        for (const command of commands) {
            const UpdateDatabase = async () => {
                for (const dbcommand of dbCommands) {
                    if (dbcommand.Name === command.name) {
                        if (
                            dbcommand.Command !== command.description ||
                            dbcommand.Perm !== command.permission ||
                            dbcommand.Category !== command.category ||
                            dbcommand.Cooldown !== command.cooldown
                        ) {
                            sql.Query(`UPDATE Commands SET Command=?, Perm=?, Category=?, Cooldown=? WHERE Name=?`, [command.description, command.permission, command.category, command.cooldown, command.name]);
                        }
                    } else {
                        return false;
                    }
                }
                return true;
            }

            if (await UpdateDatabase()) {
                if (disableCommand.length && command.category !== "Core command" && command.category !== "Dev command") {
                    for (const user of disableCommand) {
                        let disabledList = await sql.Query(`
                        SELECT disabled_commands
                        FROM Streamers
                        WHERE username=?`,
                            [user.username]);

                        console.log(disabledList)
                        disabledList = JSON.parse(disabledList[0].disabled_commands);
                        disabledList.push(command.name);
                        disabledList = JSON.stringify(disabledList);

                        await sql.Query(`UPDATE Streamers SET disabled_commands=? WHERE username=?`, [disabledList, user.username]);

                    }
                }
                await sql.Query('INSERT INTO Commands (Name, Command, Perm, Category, Cooldown) values (?, ?, ?, ?, ?)', [command.name, command.description, command.permission, command.category, command.cooldown]);
            }
        }
        const commandNames = commands.map(x => x.name);
        const commandDiff = dbCommands.filter(x => !commandNames.includes(x.name));

        for (const dbCommand of commandDiff) {
            await sql.Query('DELETE FROM Commands WHERE Name=?', [dbCommand.Name]);
        }

    }
};