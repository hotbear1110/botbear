require('dotenv').config();
const got = require('got');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'test2',
	ping: true,
	description: 'test',
	permission: 2000,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			const userlist = await sql.Query('SELECT username FROM MyPoints');
			for (const realuser of userlist) {
				let userchannel = [];
				userchannel.push(`"${realuser.username[0]}"`);
				userchannel.push(`"${realuser.username[1].replace('#', '')}"`);

				let olduserchannel = [];
				olduserchannel.push(`"${realuser.username[0]}"`);
				olduserchannel.push(`"${realuser.username[1]}"`);
				await sql.Query('UPDATE MyPoints SET username=? WHERE username=?', [`[${userchannel}]`, `[${olduserchannel}]`]);
				console.log(userchannel);
			}

			return 'Okayge done';
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};