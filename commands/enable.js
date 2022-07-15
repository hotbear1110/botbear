require('dotenv').config();
const _ = require('underscore');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'enable',
	ping: true,
	description: 'This command will let you enable different commands in your own chat or a chat you are mod in',
	permission: 100,
	category: 'Core command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			if (!user.mod && channel !== user.username && user['user-id'] != process.env.TWITCH_OWNERUID) {
				return;
			}
			switch (input[2]) {
			case 'command': {
				if (!input[3]) {
					return 'Please specify a command to enable';
				}

				let command = input[3].toLowerCase();

				let disabledList = await sql.Query(`
                    SELECT disabled_commands
                    FROM Streamers
                    WHERE username=?`,
				[channel]);

				disabledList = JSON.parse(disabledList[0].disabled_commands);

				if (!disabledList.includes(command)) {
					return 'That command is not disabled';
				}

				disabledList.splice(disabledList.indexOf(command), 1);

				disabledList = JSON.stringify(disabledList);


				sql.Query('UPDATE Streamers SET disabled_commands=? WHERE username=?', [disabledList, channel]);

				return `${command} is now enabled :)`;
			}
			case 'category': {
				if (!input[3]) {
					return 'Please specify a category to enable';
				}

				let category = input[3].toLowerCase();

				if (category === 'core') {
					return 'Core commands can\'t be disabled, so there is no enabling them';
				}

				let disabledList = await sql.Query(`
                    SELECT disabled_commands
                    FROM Streamers
                    WHERE username=?`,
				[channel]);

				disabledList = JSON.parse(disabledList[0].disabled_commands);

				let commandList = await sql.Query(`
                    SELECT *
                    FROM Commands`);

				let iscategory = false;
				let isdisabled = false;

				_.each(commandList, function (commandName) {

					if (commandName.Category.toLowerCase() === `${category} command`) {
						iscategory = true;
						if (disabledList.includes(commandName.Name)) {
							isdisabled = true;
							disabledList.splice(disabledList.indexOf(commandName.Name), 1);
						}
					}
				});

				if (iscategory === false) {
					return `${category} is not a category! Do: "bb commands" to see a list of available category`;
				}

				if (isdisabled === false) {
					return `All ${category} commands are already enabled!`;
				}

				disabledList = JSON.stringify(disabledList);


				sql.Query('UPDATE Streamers SET disabled_commands=? WHERE username=?', [disabledList, channel]);

				return `All ${category} commands are now enabled :)`;
			}
			case 'all': {
				let disabledList = await sql.Query(`
                    SELECT disabled_commands
                    FROM Streamers
                    WHERE username=?`,
				[channel]);

				disabledList = JSON.parse(disabledList[0].disabled_commands);

				let commandList = await sql.Query(`
                    SELECT *
                    FROM Commands`);

				let isdisabled = false;

				_.each(commandList, function (commandName) {
					if (commandName.Category !== 'Core command' && commandName.Category !== 'Dev command') {
						if (disabledList.includes(commandName.Name)) {
							disabledList.splice(disabledList.indexOf(commandName.Name), 1);
						}
					}

				});

				if (isdisabled === false) {
					return 'All commands are already enabled';
				}

				disabledList = JSON.stringify(disabledList);


				sql.Query('UPDATE Streamers SET disabled_commands=? WHERE username=?', [disabledList, channel]);

				return 'All commands are now enabled :)';
			}
			default:
				return 'Please specify if you want to enable: command, category or all.';
			}
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};