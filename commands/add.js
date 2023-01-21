const sql = require('./../sql/index.js');

module.exports = {
    name: 'add',
    ping: true,
    description: 'Can add "features" to the bot. This to add: "bb add alias [command] [alias(es)]"',
    permission: 2000,
    category: 'Dev command',
    noBanphrase: true,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            switch (input[2]) {
                case 'alias': {
                    let command = input[3];
                    const commandlist = await sql.Query('SELECT * FROM Commands WHERE Name=?', [command]);

                    if (!commandlist.length) {
                        return `${command} is not a command`;
                    }
                    let aliases = input.slice(4);

                    let data = await sql.Query('SELECT Aliases FROM Aliases');
                    data = data[0].Aliases;

                    let newdata = data.toString().replaceAll('[', '').replaceAll(']', '').split(',');

                    let alreadyAlias = [];
                    let addedAliases = [];
                    let iscommand = [];
                    for (const alias of aliases) {
                        const commandlist = await sql.Query('SELECT * FROM Commands WHERE Name=?', [alias]);
                        if (commandlist.length) {
                            iscommand.push(alias);
                        } else {
                            for (const oldalias of newdata) {
                                if (oldalias[alias]) {
                                    alreadyAlias.push(alias);
                                }
                            }
                            if (!alreadyAlias.includes(alias)) {
                                newdata.push(`{
                                "${alias}": "${command}"
                            }`);
                                addedAliases.push(alias);
                            }
                        }
                    }
                    await sql.Query('UPDATE Aliases SET Aliases=?', [`[${newdata.toString()}]`]);

                    let iscommand2 = '';
                    if (iscommand.length) {
                        iscommand2 = `- The follow aliases are command names: (${iscommand.toString().replaceAll(',', ', ')})`;
                    }

                    let alreadyAlias2 = '';
                    if (alreadyAlias.length) {
                        alreadyAlias2 = `- The follow aliases already exists: (${alreadyAlias.toString().replaceAll(',', ', ')})`;
                    }

                    if (!addedAliases.length) {
                        return `${alreadyAlias2} ${iscommand2}`;
                    }

                    return `Successfully added the aliases (${addedAliases.toString().replaceAll(',', ', ')}) to ${command}. ${alreadyAlias2} ${iscommand2}`;
                }
            }
        } catch (err) {
            console.error(err);
            return 'FeelsDankMan Error';
        }
    }
};