let whisperHandler = require('../tools/whisperHandler.js').whisperHandler;
const tools = require('../tools/tools.js');

module.exports = {
	name: 'whisper',
	ping: false,
	description: 'This command makes the bot whisper a user',
	permission: 2000,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

			const message = input.slice(3).join(' ');

			const userID = tools.getUserIDs([input[2]]);

			new whisperHandler(userID, message).newWhisper();

			return;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};