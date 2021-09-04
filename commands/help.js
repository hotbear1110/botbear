const tools = require("../tools/tools.js");

module.exports = {
    name: "help",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            if (!input[2]) {
                return 'List of commands: https://botbear.github.io/ - If you want help with a command, write: "bb help *command*"';
            }
            const Alias = new tools.Alias(`bb ${input[2]}`);
            realcommand = input[2].replace(Alias.getRegex(), Alias.getReplacement()).split(' ');
            const commandlist = await tools.query(`SELECT * FROM Commands WHERE Name=?`, [realcommand]);

            if (!commandlist.length) {
                return;
            }
            
            return `bb ${input[2]}: ${commandlist[0].Command}`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}