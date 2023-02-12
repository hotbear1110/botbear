module.exports = {
	name: 'rps',
	description: 'Play rock-paper-scissors with bb',
	ping: true,
	permission: 0,
	category: 'Fun command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		// Set up the possible choices
		const choices = ['rock', 'paper', 'scissors'];

		// Get the user's choice, default to rock if none provided
		const userChoice = input[2] && input[2].toLowerCase();
		const index = choices.indexOf(userChoice);
		const validInput = index > -1;
		const choice = validInput ? choices[index] : 'rock';

		// Get the bot's choice
		const botChoice = choices[Math.floor(Math.random() * choices.length)];

		// Determine the winner
		let result = '';
		if (choice === botChoice) {
			result = 'It\'s a tie!';
		} else if ((choice === 'rock' && botChoice === 'scissors') || (choice === 'paper' && botChoice === 'rock') || (choice === 'scissors' && botChoice === 'paper')) {
			result = 'You win!';
		} else {
			result = 'The bot wins!';
		}

		// Return the result
		return `You chose ${choice}. The bot chose ${botChoice}. ${result}`;
	},
};
