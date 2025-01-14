const { got } = require('./../got');
const sql = require('./../sql/index.js');
const htmlparser = require('node-html-parser')

module.exports = {
	name: 'currentgametime',
	ping: true,
	description: 'Gets the total time the streamer has been in the current category, ever',
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
            const gameData = await sql.Query('SELECT game FROM Streamers WHERE username=?', [channel]);
            
            const game = gameData[0].game;

            const categoryData = await got(`https://api.twitch.tv/helix/search/categories?query=${game}&first=1`, {
				headers: {
					'client-id': process.env.TWITCH_CLIENTID,
					'Authorization': process.env.TWITCH_AUTH
				}
			}).json();

            const categoryID = categoryData.data[0].id;
            
            const response = await got(`https://twitchtracker.com/${channel}/games/${categoryID}`);

            const html = htmlparser.parse(response)

            const test = [];

            html.querySelectorAll(".g-x-s-block").forEach((x) => test.push(x.textContent))

            const time = test.find((x) => { if (x.includes("Time streamed")) {return true} }).split('\n')[1];

			return time;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};