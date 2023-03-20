const { got } = require('./../got');

module.exports = {
	name: 'downdetector',
	ping: true,
	description: 'checks if a website is down',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Info command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: false,
	channelSpecific: false,
	activeChannel: '',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            const url = (input[2].match(/^(https?:\/\/)/)) ? input[2] : 'https://' + input[2];

            let response = 404;
            let isup = false;
            try {
                const connection = await got(url, {
                    timeout: {
                        socket: 5000
                    },
                    throwHttpErrors: false
                });
                response = (connection.statusCode) ?  connection.statusCode : 404;

                isup = true;
              } catch (err) {
                response = err.code;
                isup = !(['ETIMEDOUT', 'ENOTFOUND'].includes(err.code));
                console.error(err.request);
              }
			return isup ? url + ' seems to be working | response: ' + response : url + ' seems to be down | response: ' + ((response === 'ETIMEDOUT') ? 'Server timed out' : 'Server not found');
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};