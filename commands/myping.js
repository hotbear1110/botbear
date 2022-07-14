require('dotenv').config();
const tools = require('../tools/tools.js');
const got = require('got');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'myping',
	ping: true,
	description: 'This command will register you for game notifications for certain games. Available myping commands: "bb myping [add/remove]"(will add/remove a game from your ping list), "bb myping list"(will give you a list of the games you will get notified by)',
	permission: 100,
	category: 'Notify command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			switch (input[2]) {
			case 'add': {
				const gameUsers = await sql.Query(`SELECT * FROM Streamers WHERE username="${channel}"`);
				let gameusers = JSON.parse(gameUsers[0].game_ping);

				if (gameusers.includes(user.username)) {
					return 'You should remove your "global" game notification, by doing "bb remove game" first';
				}
				input.splice(0, 3);
				let emote = input.toString().replaceAll(',', ' ');
				let realgame = await got(`https://api.twitch.tv/helix/games?name=${emote}`, {
					headers: {
						'client-id': process.env.TWITCH_CLIENTID,
						'Authorization': process.env.TWITCH_AUTH
					},
					timeout: 10000
				}).json();
				if (!realgame.data[0]) {
					return `"${emote}", is either not a twitch category, or it's not specific enough!`;
				}
				realgame = realgame.data[0];
				realgame = realgame['name'];

				let userchannel = [];
				userchannel.push(`"${user.username}"`);
				userchannel.push(`"${channel}"`);



				const alreadyJoined = await sql.Query(`
                SELECT *
                FROM MyPing
                WHERE username=?`,
				[`[${userchannel}]`]);

				if (!alreadyJoined.length) {
					await sql.Query('INSERT INTO MyPing (username, game_pings) values (?, ?)', [`[${userchannel}]`, `["${realgame}"]`]);
					return `The game ${realgame} has been added to your ping list :)`;
				}

				let game_list = JSON.parse(alreadyJoined[0].game_pings);

				if (game_list.includes(realgame)) {
					return 'That game is already in your ping list :) You can do \'bb myping list\' to see your list.';
				}
				game_list.push(realgame);
				game_list = JSON.stringify(game_list);

				await sql.Query('UPDATE MyPing SET game_pings=? WHERE username=?', [game_list, `[${userchannel}]`]);
				return `The game ${realgame} has been added to your ping list :) You can do 'bb myping list' to see your list.`;
			}
			case 'remove': {
				let userchannel = [];
				userchannel.push(`"${user.username}"`);
				userchannel.push(`"${channel}"`);

				if (input.length == 4 && input[3] === 'all') {
					await sql.Query('UPDATE MyPing SET game_pings=? WHERE username=?', ['[]', `[${userchannel}]`]);
					return 'Your ping list is now empty :)';

				}
				input.splice(0, 3);
				let emote2 = input.toString().replaceAll(',', ' ');
				let realgame = await got(`https://api.twitch.tv/helix/games?name=${emote2}`, {
					headers: {
						'client-id': process.env.TWITCH_CLIENTID,
						'Authorization': process.env.TWITCH_AUTH
					},
					timeout: 10000
				}).json();
				if (!realgame.data[0]) {
					return `"${input}", is either not a twitch category, or it's not specific enough!`;
				}
				realgame = realgame.data[0];
				realgame = realgame['name'];


				const alreadyJoined = await sql.Query(`
                SELECT *
                FROM MyPing
                WHERE username=?`,
				[`[${userchannel}]`]);

				if (!alreadyJoined.length) {
					return 'FeelsDankMan You don\'t have any games in your ping list to remove!';
				}

				let game_list2 = JSON.parse(alreadyJoined[0].game_pings);

				if (!game_list2.includes(realgame)) {
					return 'FeelsDankMan That game is not in your ping list! You can do \'bb myping list\' to see your list.';
				}

				for (var i = 0; i < game_list2.length; i++) {

					if (game_list2[i] === realgame) {

						game_list2.splice(i, 1);
					}

				}
				game_list2 = JSON.stringify(game_list2);

				await sql.Query('UPDATE MyPing SET game_pings=? WHERE username=?', [game_list2, `[${userchannel}]`]);
				return `The game ${realgame} has been removed from your ping list :)`;
			}
			case 'list': {
				let username = user.username;
				if (input[3]) {
					if (input[3].startsWith('@')) {
						input[3] = input[3].substring(1);
					}
					username = input[3];
				}
				let userchannel = [];
				userchannel.push(`"${username}"`);
				userchannel.push(`"${channel}"`);

				const alreadyJoined = await sql.Query(`
                        SELECT *
                        FROM MyPing
                        WHERE username=?`,
				[`[${userchannel}]`]);

				if (!alreadyJoined.length || alreadyJoined[0].game_pings == '[]') {
					return 'FeelsDankMan ! You don\'t have a game list yet. You should add a game first, by typing "bb myping add *game*"';
				}
				else {

					const gamelist = await sql.Query('SELECT * FROM MyPing WHERE username=?', [`[${userchannel}]`]);
					let listgames = JSON.parse(gamelist[0].game_pings);
					listgames = listgames.toString().replaceAll(',', '\n');
					let user = '';
					if (input[3]) {
						user = `${input[3]}'s'`;
					}

					let hastebinlist = await tools.makehastebin(`${username}'s game list, from channel: ${channel}\n\nGame list:\n${listgames}`);

					return `${user} Game list: ${hastebinlist}.txt`;
				}
			}
			default: 
				return 'bb myping [add/remove]"(will add/remove a game from your ping list), "bb myping list"(will give you a list of the games you will get notified by)';
			}

		} catch (err) {
			console.log(err);
			if (err.name) {
				if (err.name === 'TimeoutError') {
					return `FeelsDankMan api error: ${err.name}`;
				}
			}
			if (err.sqlMessage) {
				return `FeelsDankMan Sql error: ${err.sqlMessage}`;
			}
			return `FeelsDankMan Error: ${err.response.data.error}`;
		}
	}
};