module.exports = {
	name: 'NAME',
	ping: true,
	description: 'DESCRIPTION',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'CATEGORY [ ./command.category.default.js ]',
	opt_outable: false,
	showDelay: false,
	noBanphrase: false,
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			return 'THIS';
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};