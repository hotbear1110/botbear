module.exports = {
	name: 'suggestions',
	ping: true,
	description: 'This command will give you a link to a list of all the suggestions for the bot and their current status.',
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			return 'List of suggestions: https://hotbear.org/suggestions';
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};