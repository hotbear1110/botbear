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
            let url = (input[2].match(/^(https?:\/\/)/)) ? input[2] : 'https://' + input[2];
            url = (url.match(/(\.\w+)$/)) ? url : url + '.com';

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
                isup = false;
                console.error(response);
              }
			return isup ? url + ' seems to be working | response: ' + response : url + ' seems to be down | response: ' + erros[response] ?? response;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};

const erros = {
	ETIMEDOUT: 'Server timed out',
	ENOTFOUND: 'Server not found',
	EAI_AGAIN : 'DNS server failed to fulfill the request',
};