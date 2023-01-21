module.exports = {
	name: 'choose',
	ping: true,
	description: 'This command will choose an outcome from a list you input. Example: bb choose What food is best? pizza, burger, fries',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
	  if (module.exports.permission > perm) {
		return;
	  }
	  let question = input.join(" ");
	  if (!question.includes("?")) {
		return "FeelsDankMan Please include a '?' Example: bb choose What food is best? pizza, burger, fries";
	  }
  
	  let choices = question.slice(question.indexOf("?") + 1).split(/[,;]/);
	  choices = choices.map(choice => choice.trim()).filter(choice => choice !== "");
  
	  if (choices.length < 2) {
		return "Please enter more than 1 choice.";
	  }
  
	  let choice = choices[~~(Math.random() * choices.length)];
  
	  return choice;
	}
  };