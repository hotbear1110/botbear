const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'commands',
	ping: true,
	description: 'This command will give you a link to the bot´s commands. You can add "local" to the end of the command, to see the commands enabled in the chat.',
	permission: 100,
	category: 'Core command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			if (input[2]) {
				if (input[2] === 'local') {
					let disabledList = await sql.Query(`
                        SELECT disabled_commands
                        FROM Streamers
                        WHERE username=?`,
					[channel]);

					disabledList = JSON.parse(disabledList[0].disabled_commands);

					if (!disabledList.length) {
						return 'This channel has all commands enabled: https://hotbear.org/';
					}

					let commandList = await sql.Query(`
                    SELECT *
                    FROM Commands`);

					let commandsListNames = [];

					for (const command of commandList) {
						commandsListNames.push(command.Name.toLowerCase());
					}

					for (const commandName of disabledList) {
						commandsListNames.splice(commandsListNames.indexOf(commandName), 1);
					}

					commandsListNames = commandsListNames.toString().replaceAll(',', '\n');

					let hastebinlist = await tools.makehastebin(`List of enabled commands in #${channel}:\n\n${commandsListNames}`);

					return `Local command list: ${hastebinlist}.txt`;

				}
			}
			return 'List of commands: https://hotbear.org/';
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};