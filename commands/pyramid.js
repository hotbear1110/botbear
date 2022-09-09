const cc = require('../bot.js').cc;

module.exports = {
	name: 'pyramid',
	ping: true,
	description: 'spam pyramids',
	permission: 2000,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let message = input.slice();
			message.shift();
			message.shift();
			message.shift();
            
            message = message.join(' ');
			let width = input[2];
			let length = input[2]*2;
            let peakLength = message.repeat(length);
            if (peakLength.length > 500) {
                return 'nymnDank message is too long';
            }
            for (let i = 0; i < length; i++) {
                let msgLength = (i < width) ? i+1 : length - (i+1);
                let tempMsg = Array.from({length: msgLength}).fill(message).join(' ');
                console.log(tempMsg);
                cc.say(channel, tempMsg);
            }

			return;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};