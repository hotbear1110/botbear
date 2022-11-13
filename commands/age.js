module.exports = {
	name: 'age',
	ping: false,
	description: 'guesses the age of a chatter',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: true,
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

            let age = ~~(Math.random() * 102 + 18);

			return `${input[2] ?? user.username} is ${age} years old.`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};