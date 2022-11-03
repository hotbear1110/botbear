const sql = require('./../sql/index.js');

module.exports = {
	name: 'permission',
	ping: false,
	description: 'This command will change a given users permission. This will allow/disallow the user to do certain commands. Example: "bb permission NymN 2000"(will change Nymn´s permission to 2000)',
	permission: 2000,
	category: 'Dev command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			await sql.Query('UPDATE Users SET permission=? WHERE username=?', [input[3], input[2]]);
			return `${input[2]} now has permission ${input[3]}`;

		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};