const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'help',
	ping: true,
	description: 'This command will give you information about any onther command. Example: "bb help followage"',
	permission: 100,
	category: 'Core command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			if (!input[2]) {
				return 'List of commands: https://hotbear.org/ - If you want help with a command, write: "bb help *command*"';
			}

			input.splice(1,1);
            input = await tools.Alias(input.join(' '));

            const realcommand = input[1];
			/** @type { Array<SQL.Commands> } */
			const commandlist = await sql.Query('SELECT * FROM Commands WHERE Name=?', [realcommand]);

			if (!commandlist.length) {
				return 'Command not found FeelsDankMan';
			}

			let cooldown = commandlist[0].Cooldown;
			if (!commandlist[0].Cooldown) {
				cooldown = 3;
			}

			if (commandlist[0].Name === 'trivia' || commandlist[0].Name === 'trivia2') {
				let cd = await sql.Query('SELECT trivia_cooldowns FROM Streamers WHERE username = ?', [channel]);

				if (cd[0].trivia_cooldowns === null) {
					cd[0].trivia_cooldowns === 30000;
					sql.Query('UPDATE Streamers SET trivia_cooldowns = 30000 WHERE username = ?', [channel]);
				}

				cooldown = cd[0].trivia_cooldowns / 1000;
			}



			return `${commandlist[0].Command} - Permission lvl: ${commandlist[0].Perm} - Cooldown: ${cooldown}s`;

		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};