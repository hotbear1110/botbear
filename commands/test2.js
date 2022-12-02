require('dotenv').config();
const sql = require('./../sql/index.js');
const { got } = require('./../got');

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
			let msg = 'db test add name:"bibi" pet:"rat" user:"forsen" link:"test"';

			this.user = [...msg.matchAll(/name:"([a-z\s0-9]+)"/gi)][0];
			this.user = (this.user) ? this.user[1] : 'test123';

			return this.user;
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};