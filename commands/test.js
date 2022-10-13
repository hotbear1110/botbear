const { got } = require('./../got');
const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');
let messageHandler = require('../tools/messageHandler.js').messageHandler;

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

			let test = ['test test tetst etstst es sdf sd', ' 453 543 543 5435 43 543 54334 5sdegdg ss sfsdfsf s  ', 'snfkjdsgbjhkfdjgndjkn sjlk gnsdjgs j'];
			test.every((msg) => new messageHandler(channel, msg, true).newMessage());

			console.log(test);
			return;
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};