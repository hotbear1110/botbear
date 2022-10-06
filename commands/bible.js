const { got } = require('./../got');

module.exports = {
	name: 'bible',
	ping: true,
	description: 'This command will give a random bible quote',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

			const url = 'https://labs.bible.org/api/?passage=random&type=json';

			const response = await got(url).json();
			return `[${response[0].bookname} ${response[0].chapter}:${response[0].verse}]: ${response[0].text} Prayge`;

		} catch (err) {
			console.log(err);
			return 'FeelsDankMan lost my bible';
		}
	}
};
