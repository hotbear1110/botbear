const tools = require("../tools/tools.js");

module.exports = {
    name: "help",
    ping: true,
    description: 'This command will give you information about any onther command. Example: "bb help followage"',
    permission: 100,
    category: "Bot command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            if (!input[2]) {
                return 'List of commands: https://botbear.github.io/ - If you want help with a command, write: "bb help *command*"';
            }
            const Alias = new tools.Alias(`bb ${input[2]}`);
            realcommand = input[2].replace(Alias.getRegex(), Alias.getReplacement()).split(' ');
            const commandlist = await tools.query(`SELECT * FROM Commands WHERE Name=?`, [realcommand]);

            if (!commandlist.length) {
                return;
            }
            
            return `Command name: ${commandlist[0].Name}. Category: ${commandlist[0].Category}. Description: ${commandlist[0].Command} - Permission lvl: ${commandlist[0].Perm}`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}