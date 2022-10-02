let messageHandler = require('../tools/messageHandler.js').messageHandler;
const { promisify } = require('node:util');
const { exec, execSync } = require('node:child_process');

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
            const shell = promisify(exec);

			await new messageHandler(channel, 'ppCircle git pull...', true).newMessage();

			const response = await shell('sudo git pull');

            await response;

            if (response.stdout === 'Already up to date.\n') {
                return 'FeelsDankMan Already up to date.';
            }
              else {
                await Promise.all([await new messageHandler(channel, 'Updated.... restarting bot ppCircle', true).newMessage()]);
              
				await Sleep();

                execSync('sudo systemctl restart botbear2');
                
              return;
              }
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};

const Sleep = async (seconds = 2) => {
    return new Promise((Resolve) => {
        setTimeout(() => {
            Resolve();
        }, seconds*1000);
    });
};