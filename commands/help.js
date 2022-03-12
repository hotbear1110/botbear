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
            let realcommand = input[2].replace(Alias.getRegex(), Alias.getReplacement());
            const commandlist = await tools.query(`SELECT * FROM Commands WHERE Name=?`, [realcommand.toLowerCase()]);

            if (!commandlist.length) {
                return 'Command not found FeelsDankMan';
            }

            if (commandlist[0].Name === 'trivia' || commandlist[0].Name === 'trivia2') {
                let realchannel = channel.substring(1);
                let cd = await tools.query("SELECT `trivia_cooldowns` FROM `Streamers` WHERE `username` = ?", [realchannel]);
        
                if (cd[0].trivia_cooldowns === null) {
                    cd[0].trivia_cooldowns === 30000;
                    tools.query("UPDATE `Streamers` SET `trivia_cooldowns` = 30000 WHERE `username` = ?", [realchannel]);
                } 
        
                if(commandlist[0].Name === 'trivia'){
                    return `This command will start a new trivia in chat (The cooldown is at ${cd[0].trivia_cooldowns.formattedTime()} and the trivia times out after 60 seconds.).
                                Specific category: "bb trivia sports". Categories: [ https://haste.zneix.eu/uhedagatig.txt ] - Permission lvl: ${commandlist[0].Perm}`;
                } else {
                    return `This command will start a new trivia in chat (The cooldown is at ${cd[0].trivia_cooldowns.formattedTime()} and the trivia times out after 60 seconds.)
                                 - Api used: [ https://gazatu.xyz/ ] - Permission lvl: ${commandlist[0].Perm}`;
                }      
            } else {
                return `${commandlist[0].Command} - Permission lvl: ${commandlist[0].Perm}`; 
            }         
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
            
        }
    }
}