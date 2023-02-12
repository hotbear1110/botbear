module.exports = {
    name: 'guess',
    ping: true,
    description: 'Guess a number between 1 and 10!',
    permission: 100,
    category: 'Fun command',
    noBanphrase: true,
    execute: async (channel, user, input, perm) => {
      try {
        if (module.exports.permission > perm) {
          return;
        }
        
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        const guess = parseInt(input[2]);
        
        if (isNaN(guess)) {
          return 'Please provide a valid number.';
        }
        
        if (guess < 1 || guess > 10) {
          return 'Please guess a number between 1 and 10.';
        }
        
        if (guess === randomNumber) {
          return `Congratulations, ${user}! You guessed the number!`;
        } else {
          return `Sorry, ${user}. The number was ${randomNumber}. Try again!`;
        }
      } catch (err) {
        console.log(err);
        return 'FeelsDankMan Error';
      }
    }
  };
  