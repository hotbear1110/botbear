const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'channels',
	ping: true,
	description: 'Posts a list of all the channels the bot is active in',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Info command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: true,
	channelSpecific: false,
	activeChannel: '',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}            
            const Streamers = await sql.Query('SELECT username FROM Streamers');
            
            let streamer_list = Streamers.map(x => x.username);
            
            streamer_list = streamer_list.toString().replaceAll(',', '\n');
            
            let hastebinlist = await tools.makehastebin(`All channels the bot is active in:\n\n${streamer_list}`);
            
            return `All channels the bot is active in: ${hastebinlist}`;

            } catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};