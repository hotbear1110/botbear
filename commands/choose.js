module.exports = {
	name: 'choose',
	ping: true,
	description: 'This command will choose an outcome from a list you input. Example: bb choose What food is best? pizza, burger, fries',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            let choices = input.toString().replaceAll(',', ' ').split('?')[1].split(' ').filter(x => x);

            let choice = choices[~~(Math.random() * choices.length)];
            
			return `I pick ${choice}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};