const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');
const got = require('got');

module.exports = {
	name: 'cdr',
	ping: true,
	description: 'This command will register/unregiter you for notifications for "ThePositiveBot´s" cookie cdr, this send you whispers as default. Available commands: "bb cdr [register/unregister]", "bb cdr status"(will tell you the time remaining until you can get your next cdr), "bb cdr whisper"(Toggles between whisper on and whisper off)',
	permission: 100,
	category: 'Notify command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			switch (input[2]) {
			case 'register': {
				const register = await sql.Query('SELECT * FROM Cdr WHERE User=?', [user.username]);

				if (!register.length) {
					await sql.Query('INSERT INTO Cdr (User) values (?)', [user.username]);

					return 'You are now registered for cookie cdr notifications (The reminders might not work properly untill you use your next cdr)';

				} else {
					return 'You are already registered for cookie cdr notifications.  Do "bb cdr mode" to change where the bot responds';
				}

            }
			case 'unregister': {
                const unregister = await sql.Query('SELECT * FROM Cdr WHERE User=?', [user.username]);
                
				if (unregister.length) {
                    await sql.Query('DELETE FROM Cdr WHERE User=?', [user.username]);
                    
					return 'You are now unregistered for cookie cdr notifications';
				} else {
                    return 'You are not registered for cookie cdr notifications';
				}
            }
			case 'status': {
                const status = await sql.Query('SELECT * FROM Cdr WHERE User=?', [user.username]);
                
				if (status.length) {
					if (status[0].RemindTime !== null) {
						let cd = status[0].RemindTime - new Date().getTime();
						cd = tools.humanizeDuration(cd);

						return `There is no cdr for you right now, your next cdr is available in ${cd}`;
					}
					if (status[0].RemindTime === null) {
						let cdrCD = await got(`https://api.roaringiron.com/cooldown/${user.username}`, { timeout: 10000 }).json();

						if (cdrCD['error']) {
							return cdrCD['error'];
						}
						if (cdrCD['cdr_available'] === true) {
							return 'You have a cookie wating for you :)';
						} else {
							let cd = Date.now() - (new Date(cdrCD['cdr_reset_time']).getTime() + 10800000);
							cd = tools.humanizeDuration(cd);

							return `There is no cdr for you right now, your next cdr is available in ${cd}`;
						}
					} else {
                        return 'You have a cdr waitng for you :)';
					}
				} else {
					let cdrCD = await got(`https://api.roaringiron.com/cooldown/${user.username}`, { timeout: 10000 }).json();

					if (cdrCD['error']) {
						return cdrCD['error'];
					}
					if (cdrCD['cdr_available'] === true) {
						return 'You have a cookie wating for you :)';
					} else {
						let cd = Date.now() - (new Date(cdrCD['cdr_reset_time']).getTime() + 10800000);
						cd = tools.humanizeDuration(cd);

						return `There is no cdr for you right now, your next cdr is available in ${cd}`;
					}
				}
            }
			case 'mode': {
                const isregistered = await sql.Query('SELECT * FROM Cdr WHERE User=?', [user.username]);

				if (isregistered.length) {
					switch (input[3]) {
					case 'default': {
						let cdrmode = await sql.Query(`
                                    SELECT Mode
                                    FROM Cdr
                                    WHERE User=?`,
						[user.username]);

						if (cdrmode[0].Mode !== 0) {
							cdrmode[0].Mode = 0;
							await sql.Query('UPDATE Cdr SET Mode=? WHERE User=?', [cdrmode[0].Mode, user.username]);
							return 'I will now remind you in the chat where you last used your cdr';
						} else {
							return 'You already use this mode';
						}
					}
					case 'mychat': {
						let cdrmode = await sql.Query(`
                                    SELECT Mode
                                    FROM Cdr
                                    WHERE User=?`,
						[user.username]);

						if (cdrmode[0].Mode !== 1) {
							cdrmode[0].Mode = 1;
							await sql.Query('UPDATE Cdr SET Mode=? WHERE User=?', [cdrmode[0].Mode, user.username]);
							return 'I will now remind you in your own chat';
						} else {
							return 'You already use this mode';
						}
					}
					case 'botchat': {
						let cdrmode = await sql.Query(`
                                        SELECT Mode
                                        FROM Cdr
                                        WHERE User=?`,
						[user.username]);

						if (cdrmode[0].Mode !== 2) {
							cdrmode[0].Mode = 2;
							await sql.Query('UPDATE Cdr SET Mode=? WHERE User=?', [cdrmode[0].Mode, user.username]);
							return 'I will now remind you in #botbear1110';
						} else {
							return 'You already use this mode';
						}
					}
					default:
						return 'Do "bb cdr mode default/mychat/botchat" to change response mode  for "ThePositiveBot´s" cdr - "default" Will remind you in the chat where you last used your cdr | "mychat" = your own chat | "botchat" = #botbear1110 (the bots chat)';
					}
				} else {
					return 'You are not registered for cdr notifications. Do "bb cdr register" to register';
				}
            }
			default:
				return 'This command is for registering/unregitering you for notifications for "ThePositiveBot´s" cookie cdr. Available cdr commands: "bb cdr register", "bb cdr unregister", "bb cdr status", "bb cdr whisper"';
			}

		} catch (err) {
			console.log(err);
			if (err.name) {
				if (err.name === 'TimeoutError') {
					return `FeelsDankMan api error: ${err.name}`;
				}
			}
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};