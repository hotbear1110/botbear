const sql = require('./../sql/index.js');

module.exports = {
	name: 'ping',
	ping: true,
	description: 'This command will make the bot respond with "pong!" and the tmi delay aswell as the internal delay, if the bot is online.',
	permission: 100,
	category: 'Core command',
	showDelay: true,
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			const latency = await sql.Query('SELECT Latency FROM Latency');
			let delay;

			if (!latency.length) {
				delay = '*no data yet*';
			}
			else {
				delay = JSON.parse(latency[latency.length - 1].Latency) * 1000 + 'ms';
			}

			return `nymnDank pong! - Tmi delay: ${delay} - Internal delay:`;
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};