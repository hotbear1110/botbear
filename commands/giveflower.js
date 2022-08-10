module.exports = {
	name: 'giveflower',
	ping: false,
	description: 'Give a chatter a flower nymnHappy',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			if (input[2]) {
				return `${input[2]}, nymnFlower`;
			}
			return `${user.username}, nymnFlower`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};