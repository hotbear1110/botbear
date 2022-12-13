const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');
const { got } = require('./../got');

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

            const markovAPI = await got('https://magnolia.melon095.live/api/markov/list').json();
            console.log(markovAPI);
            let markov_channels = markovAPI.data.channels;

            let markov_list = markov_channels.map(x => !streamer_list.includes(x.username) && x.username).filter(Boolean);

            streamer_list = streamer_list.toString().replaceAll(',', '\n');
            markov_list = markov_list.toString().replaceAll(',', '\n');

            let hastebinlist = await tools.makehastebin(`All channels the bot is active in:\n\n${streamer_list}\n\n\nExtra channels available for makov (If you try a channel not on the list, it will get added to the list and work after 100 messages are logged):\n\n${markov_list}`);
            
            return `All channels the bot is active in: ${hastebinlist}`;

            } catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};