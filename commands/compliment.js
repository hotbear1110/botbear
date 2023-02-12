module.exports = {
	name: 'compliment',
	ping: true,
	description: 'This command will generate a random compliment.',
	permission: 0,
	category: 'Fun command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			const compliments = [
				"You're a ray of sunshine on a cloudy day.",
				"You have the best laugh.",
				"You're more fun than bubble wrap.",
				"You have a contagious smile.",
				"You have a great sense of humor.",
				"You light up the room.",
				"You have a kind and generous heart.",
				"You have a great fashion sense.",
				"You're a great listener.",
				"You have a wonderful personality.",
				"You're a true gem.",
				"You're incredibly smart and thoughtful.",
				"You have a unique and captivating spirit.",
				"You make a difference in the world just by being in it.",
				"You're a fantastic friend.",
				"You're simply amazing.",
			];

			const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];

			return `@${user['display-name']}, ${randomCompliment}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	},
};