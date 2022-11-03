module.exports = {
	name: 'cock',
	ping: true,
	description: 'This command will make the bot respond with: "Okayge cock!"',
	permission: 100,
	category: 'Random command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			return 'Okayge cock!';
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};