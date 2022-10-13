const { got } = require('./../got');
const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'test',
	ping: true,
	description: '123',
	permission: 2000,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

			const [streamer] = await sql.Query('SELECT * FROM Streamers WHERE uid=?', 70811818);
            
            const titleusers = JSON.parse(streamer.title_ping).
                                filter(Boolean).
                                join(' ');

			let titleuserlist = tools.splitLine(titleusers, 290 - 'No stream Thursday :)'.length);

			console.log(titleuserlist);
			return;
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};