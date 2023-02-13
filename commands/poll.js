module.exports = {
	name: 'poll',
	ping: true,
	description: 'Creates a poll with the given question and options. Usage: "bb poll Question? Option1 Option2 Option3"',
	permission: 100,
	category: 'Random command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			if (input.length < 4) {
				return 'Usage: "bb poll Question? Option1 Option2 Option3"';
			}
			const question = input.slice(2).join(' ').replace('?', '');
			const options = input.slice(3);
			const reactions = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
			if (options.length > reactions.length) {
				return 'Too many options for the poll!';
			}

			let pollMessage = `${question}\n`;
			for (let i = 0; i < options.length; i++) {
				pollMessage += `${reactions[i]} ${options[i]}\n`;
			}

			const poll = await channel.send(pollMessage);

			for (let i = 0; i < options.length; i++) {
				await poll.react(reactions[i]);
			}

			return;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
