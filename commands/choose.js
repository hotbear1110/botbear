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
            if (!input.toString().includes('?')) {
                return 'FeelsDankMan Please include a "?" Example: bb choose What food is best? pizza, burger, fries';
            }
            let choices = input.join(' ')
								.slice(input.join(' ')
								.indexOf('?')+1)
								.replace(/(^[;,])|\?/g, '')
								.split(/[,;]/);
   
            let choice = choices[~~(Math.random() * choices.length)];
			return choice;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};