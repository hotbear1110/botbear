require('dotenv').config();
const got = require('got');
const tools = require('../tools/tools.js');

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
			if (!process.env.THREELETTERAPI_CLIENTID) {
				return 'FeelsDankMan Error: THREELETTERAPI_CLIENTID isn`t set';
			}
			let list = input[2];
			list = await tools.optOutList(JSON.parse(list), 'randomping');
			if (!list.length) {
				return 'loooll';
			}
			console.log(list);

			
			return JSON.stringify(list);
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};