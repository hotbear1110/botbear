const sql = require('./../sql/index.js');

module.exports = {
	name: 'enablenewcommands',
	ping: true,
	description: 'Decide if you want new commands to be enabled or disabled as default',
	permission: 100,
	category: 'Core command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			if (!user.mod && channel !== user.username && user['user-id'] != process.env.TWITCH_OWNERUID) {
				return;
			}
			switch (input[2]) {
			case 'true': {
				const disableCommand = await sql.Query('SELECT command_default FROM Streamers WHERE username = ?', [channel]);

				if (disableCommand[0].command_default === 1) {
					sql.Query('UPDATE Streamers SET command_default=? WHERE username=?', [0, channel]);
					return 'New commands are now enabled by default';
				} else {
					return 'New commands are already enabled by default';
				}
			}
			case 'false': {
				const disableCommand = await sql.Query('SELECT command_default FROM Streamers WHERE username = ?', [channel]);

				if (disableCommand[0].command_default === 0) {
					sql.Query('UPDATE Streamers SET command_default=? WHERE username=?', [1, channel]);
					return 'New commands are now disabled by default';
				} else {
					return 'New commands are already disabled by default';
				}
			}
			default:
				return '"bb enablenewcommands true/false" decide if you want new commands to be enabled or disabled as default';
			}
		}
		catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
