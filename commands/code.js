const sql = require('./../sql/index.js');

module.exports = {
	name: 'code',
	ping: true,
	description: 'Gives the user a link to the source code of a given command',
	permission: 100,
	category: 'Info Command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

			if (!input[2]) {
				return 'No command specified - https://github.com/hotbear1110/botbear/blob/main/commands/';
			}

			let commandList = await sql.Query(`
                    SELECT *
                    FROM Commands`);

			if (!commandList.filter(x => x.Name === input[2]).length) {
				return `${input[2]} is not a command! Do: "bb commands" to see a list of available commands`;
			}

			return `https://github.com/hotbear1110/botbear/blob/main/commands/${input[2]}.js`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};