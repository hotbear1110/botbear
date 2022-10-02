let messageHandler = require('../tools/messageHandler.js').messageHandler;
const shell = require('child_process');

module.exports = {
	name: 'update',
	ping: false,
	description: 'updates botbear, git pull',
	permission: 2000,
	cooldown: 3, //in seconds
	category: 'Dev command',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			Promise.all([await new messageHandler(channel, 'ppCircle git pull...', true).newMessage()]);

			let response = new Promise(async (Resolve, Reject) => {
                shell.exec('sudo git pull', async (err, stdout) => {
                    if (err) {
                      console.error(err);
                      Reject();
                    }
                    console.log(stdout);

                    if (stdout === 'Already up to date.\n') {
                        Resolve('FeelsDankMan Already up to date.');
                        return;
                    } else {
                        Resolve(false);
                        return;
                    }
                  });
            });
            await response;

            if (!await response) {
                await new messageHandler(channel, 'Updated.... restarting bot ppCircle', true).newMessage();

                shell.exec('sudo systemctl restart botbear2');
                return;
                } else {
                    return await response;
                }
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};