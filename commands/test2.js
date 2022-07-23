require('dotenv').config();
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
			let [bigtest] = await sql.Query(`SELECT RemindTime, Status, User
                        FROM Cdr 
                        WHERE User = ? 
                            OR User = ?
                            OR User = ?`, 
        [input[3], input[2], input[1].replace(',', '')]);
		console.log(bigtest);
			return 'Okayge done';
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};