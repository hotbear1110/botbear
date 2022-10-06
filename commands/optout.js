const requireDir = require('require-dir');
const commands = requireDir('./');
const sql = require('../sql/index.js');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'optout',
	ping: true,
	description: 'This command will let you opt-out of other commands',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Core command',
	opt_outable: false, 
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            input.splice(1,1);
            input = await tools.Alias(input.join(' '));

            const command = input[1];

            if (typeof commands[command] === 'undefined') {
                return `${command} is not a command`;
            }

            if (!commands[command].opt_outable) {
                return `You cannot opt-out of ${command}`;
            }

            let optOutList = await sql.Query('SELECT opt_out FROM Commands WHERE Name = ?', [command]);
            optOutList = JSON.parse(optOutList[0].opt_out);

            if (optOutList.includes(user.username)) {
                return 'FeelsDankMan You are already opted-out of that command';
            }

            optOutList.push(user.username);

            optOutList = JSON.stringify(optOutList);


			sql.Query('UPDATE Commands SET opt_out=? WHERE Name=?', [optOutList, command]);


			return `You are now opted-out of the ${command} command`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};