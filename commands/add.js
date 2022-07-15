const _ = require('underscore');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'add',
	ping: true,
	description: 'Can add "features" to the bot. This to add: "bb add alias [command] [alias(es)]"',
	permission: 2000,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			switch (input[2]) {
			case 'alias': {
				if (!input[3]) {
					return 'FeelsDankMan you have to specify the command and new aliases';
				}
				let command = input[3];
				/**  @type { Array<SQL.Commands> } */
				let commandlist = await sql.Query('SELECT * FROM Commands');
				
				commandlist = commandlist.map(x => x.Name);
				
				if (!commandlist.includes(command)) {
					return `${command} is not a command`;
				}

				let aliases = input.splice(4, -1);

				/** @type { Array<SQL.Aliases> } */
				let aliasList = await sql.Query('SELECT Aliases FROM Aliases');
				aliasList = JSON.parse(this.aliasList[0].Aliases);

				/* eslint-disable no-unused-vars */ 
				aliasList = aliasList.map(({ key }) => (key));






				let aliasExists = aliases.filter(x => aliasList.includes(x));

				aliases = aliases.filter(x => !aliasList.includes(x));

				/* eslint-disable no-unused-vars */ 
				let response = '';

				if (aliasExists.length) {
					response = `The following aliases already exists: ${aliasExists.join(' ')}`;
				}
				
				// Make reponses that "trickle down" for "alias is a command" and "alias is already alias"
				// Kinda like what already is done in the old command

				// Old code for refernce
				/*
				await sql.Query('UPDATE Aliases SET Aliases=?', [`[${newdata.toString()}]`]);

				let iscommand2 = '';

				if (result[1].length) {
					iscommand2 = `- The follow aliases are command names: (${result[1].toString().replaceAll(',', ', ')})`;
				}

				let alreadyAlias2 = '';

				if (result[2].length) {
					alreadyAlias2 = `- The follow aliases already exists: (${result[2].toString().replaceAll(',', ', ')})`;

				}

				if (!result[3].length) {
					return `${alreadyAlias2} ${iscommand2}`;
				}

				return `Successfully added the aliases (${result[3].toString().replaceAll(',', ', ')}) to ${command}. ${alreadyAlias2} ${iscommand2}`;
            */
			}
        }
    } catch (err) {
        console.log(err);
        return 'FeelsDankMan Error';
    }
	}
};
