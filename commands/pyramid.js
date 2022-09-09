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
			let peak = input[2]/2;
            let peakLength = message.repeat(peak);
            if (peakLength.length > 500) {
                return 'nymnDank message is too long';
            }
            for (let i = 1; i < input[2]; i++) {
                let msgLength = (i < peak) ? i : input[2] - i;
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