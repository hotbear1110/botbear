const tools = require('../tools/tools.js');
const _ = require('underscore');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'check',
	ping: true,
	description: 'This command will check info about other users. Available check commands: "bb check permission NymN"(gives you the permission lvl)',
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
			case 'points': {
                if (input[3]) {
                    if (input[3]?.startsWith('@')) {
                        input[3] = input[3].substring(1);
                    }
                    username = input[3];
                }
                
                if (input[4]) {
                    if (input[4]?.startsWith('@')) {
                        input[4] = input[4].substring(1);
                    }
                    channel = input[4];
                }

				let userchannel = [];
				userchannel.push(`"${username}"`);
				userchannel.push(`"#${channel}"`);
				const User_trivia = await sql.Query('SELECT points FROM MyPoints WHERE username=?', [`[${userchannel}]`]);

				if (!User_trivia.length) {
					return 'That user has no points yet :)';
				}

				if (username === user.username.toLowerCase()) {
					return `has ${User_trivia[0].points} trivia points in #${channel}`;
				}
				return `${username} has ${User_trivia[0].points} trivia points in #${channel}`;
            }
			case 'leaderboard': {
                if (input[3]) {
                    if (input[3].startsWith('@')) {
                        input[3] = input[3].substring(1);
                    }
                    channel = input[3];
                }

				const Trivia_leaderboard = await sql.Query('SELECT * FROM MyPoints ORDER BY points DESC');

				let leaderboard = [];

				_.each(Trivia_leaderboard, async function (user) {
					let realuser = JSON.parse(user.username);
					if (realuser[1] === `#${channel}`) {
						leaderboard.push(`${realuser[0]}: ${user.points}`);
					}
				});
				if (!leaderboard.length) {
					return 'There are no users with points in this channel';
				}

				leaderboard = leaderboard.toString().replaceAll(',', '\n');

				let hastebinlist = await tools.makehastebin(`Trivia leaderboard for #${channel}:\n\n${leaderboard}`);

				return `Trivia leaderboard for #${channel}: ${hastebinlist}`;
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
				return 'Stuff available to check: permission, points, leaderboard, triviacooldown';
			}
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};