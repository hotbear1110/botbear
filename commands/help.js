const tools = require("../tools/tools.js");

module.exports = {
    name: "help",
    ping: true,
    description: 'This command will give you information about any onther command. Example: "bb help followage"',
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            if (!input[2]) {
                return 'List of commands: https://hotbear.xyz/ - If you want help with a command, write: "bb help *command*"';
            }

            let aliasList = await tools.query(`SELECT Aliases FROM Aliases`);

            aliasList = JSON.parse(aliasList[0].Aliases);

            const Alias = new tools.Alias(`bb ${input[2]}`, aliasList);
            let realcommand = input[2].replace(Alias.getRegex(), Alias.getReplacement()).split(' ');
            const commandlist = await tools.query(`SELECT * FROM Commands WHERE Name=?`, [realcommand]);

            if (!commandlist.length) {
                return;
            }

            return `Command name: ${commandlist[0].Name}. Category: ${commandlist[0].Category}. Description: ${commandlist[0].Command} - Permission lvl: ${commandlist[0].Perm}`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}