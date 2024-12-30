const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'check',
	ping: true,
	description: 'This command will check info about other users.',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let username = user.username;
			switch (input[2]) {
			case 'permission': {
                if (input[3]) {
                    if (input[3]?.startsWith('@')) {
                        input[3] = input[3].substring(1);
                    }
                    username = input[3];
                }
                /** @type { SQL.Users[] } */
				const User = await sql.Query('SELECT permission FROM Users WHERE username=?', [username]);

				return `${username}'s permission is: ${User[0].permission}`;
            }
			case 'triviacooldown': {
                if (input[3]) {
					if (input[3].startsWith('@')) {
						input[3] = input[3].substring(1);
					}
					channel = input[3];
				}

				const TriviaCD = await sql.Query('SELECT trivia_cooldowns FROM Streamers WHERE username=?', [channel]);

				if (!TriviaCD.length) {
					return;
				}

				return `#${channel}'s trivia cooldown is ${TriviaCD[0].trivia_cooldowns / 1000}s`;
				
            }
			default:
				return 'Stuff available to check: permission, triviacooldown';
			}
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};