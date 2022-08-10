require('dotenv').config();

module.exports = {
	name: 'test',
	ping: true,
	description: 'test',
	permission: 2000,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let url = 'https://www.google.co.uk/lulexd';

			let regex = /\.(.+?)\./gim;

			let newurl = url.replace(regex, '.(some-site).');

			return `${url} -> ${newurl}`;
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};