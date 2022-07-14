module.exports = {
	name: 'cum',
	ping: false,
	description: 'This command will make the bot cum in different ways. Example: "bb cum on NymN"',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			input.shift();
			input.shift();

			let msg = input.toString()
                        .replaceAll(',', ' ')
                        .replaceAll(/(?:^|\W)me(?:$|\W)/g, ' you ')
                        .replaceAll(/(?:^|\W)my(?:$|\W)/g, ' your ');

			return `/me I came ${msg}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};