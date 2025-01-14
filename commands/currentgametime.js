const { got } = require('./../got');
const sql = require('./../sql/index.js');
const puppeteer = require('puppeteer');

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

            const categoryData = await got(`GET https://api.twitch.tv/helix/search/categories?query=${game}&first=1`, {
				headers: {
					'client-id': process.env.TWITCH_CLIENTID,
					'Authorization': process.env.TWITCH_AUTH
				}
			}).json();

            const categoryID = categoryData.data[0].id;
            
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`https://twitchtracker.com/${channel}/games/${categoryID}`);

            const test = [];

            await page.evaluate((document) =>
                document.querySelectorAll(".g-x-s-block").forEach((x) => test.push(x.textContent)) 
                );

            const response = test.find((x) => { if (x.includes("Time streamed")) {return true} }).split('\n')[1];

			return response;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};

document.querySelectorAll(".g-x-s-block").forEach((x) => test2.push(x.textContent)) 