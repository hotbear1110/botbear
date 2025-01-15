
const { got } = require('./../got');
const sql = require('./../sql/index.js');
const htmlparser = require('node-html-parser')
const tools = require('../tools/tools.js');

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
            
            const response = await got(`https://twitchtracker.com/${channel}/games/${categoryID}`, { headers: { 'Cookie': 'cf_clearance=5f0QiGMwCgLB6BeAD_6iU0Le1ymg6n.EZoR7AbyhQpk-1736891853-1.2.1.1-8_6lTET6UE2aydR4dJXxkx8M9Qycs92tuCf7XGdkDfgqsUsQnJdIm91IzhjMHDNCdz.Mu.8vV7WvIWYAnGk9xk8CICja60zSfGgB4YzaR.rRYV0YFwGWSD0LeC8VmL4mZJm7PVUYE7dQfln0IyFsO1lnYqWGYyt2lWrZSIDKs2rXx4FpL9JAIQTM9_gyrSX.UFyjW6SP62Bu.rnRjVinMyHXzS6m.paqu2PnB.h4GS_JmriRmBGnQldETP2l6X4A4ZMcNZ_NM7uAPrw3x1WPimeIeSuTd58.obGONo1GpST92HGDqm_tWQxauUE0xQgtE7mp74YBSbo1u9EkJCaoUA', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0' } });

            const html = htmlparser.parse(response.body)

            const divs = [];

            html.querySelectorAll(".g-x-s-block").forEach((x) => divs.push(x.textContent))

            if(!divs.length) {
                return 'I unable to find any data for this category'
            }

            const min = divs.find((x) => { if (x.includes("Time streamed")) {return true} }).split('\n')[1];

            const ms = min * 60000

            const humanize_options = {
                language: 'shortEn',
                languages: {
                    shortEn: {
                        y: () => 'y',
                        mo: () => 'mo',
                        w: () => 'w',
                        d: () => 'd',
                        h: () => ' hours',
                        m: () => ' mins',
                        s: () => 's',
                        ms: () => 'ms',
                    },
                },
                units: ['h', 'm'],
                largest: 3,
                round: true,
                conjunction: ' and ',
                spacer: '',
        
            }

			return `${channel} has streamed ${game} for a total of ${tools.humanizeDuration(ms, humanize_options)}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};