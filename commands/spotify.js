require('dotenv').config();
const { got } = require('./../got');
const sql = require('./../sql/index.js');
const spotifyTools = require('../tools/spotifyTools.js');

module.exports = {
	name: 'spotify',
	ping: true,
	description: 'Shows current spotify player status',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Info command',
	opt_outable: true,
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

            const spotify_user = await sql.Query('SELECT * FROM Spotify WHERE uid = ?',[user['user-id']]);

			if (!spotify_user.length) {
				return 'You have not authorized with the bot. Please login here: https://hotbear.org/login';
			}

            let access_token = spotify_user[0].access_token;
            const refresh_token = spotify_user[0].refresh_token;
			const expires_in = spotify_user[0].expires_in;
			
			let spotifyData;

			if(Date.now() > expires_in) {
				access_token = await spotifyTools.refreshToken(user.username, refresh_token);
			}

			spotifyData = await got('https://api.spotify.com/v1/me/player', {
				throwHttpErrors: false,
				headers: {
					'Authorization': 'Bearer ' + access_token,
					'Content-Type': 'application/json'
				}
			}).json();
			

            console.log(spotifyData);

			if (!spotifyData.device) {
				return 'Nothing is curently playing';
			}

            const progress_ms = spotifyData.progress_ms;
            const duration_ms = spotifyData.item.duration_ms;
            const artist = spotifyData.item.artists[0].name;
            const title = spotifyData.item.name;

			const progress_min_sec = millisToMinutesAndSeconds(progress_ms);
			const duration_min_sec = millisToMinutesAndSeconds(duration_ms);

			return `Song: ${title} | Artist: ${artist} | Progress ${progress_min_sec}/${duration_min_sec}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};

function millisToMinutesAndSeconds(ms) {
	let minutes = Math.floor(ms / 60000);
	let seconds = ((ms % 60000) / 1000).toFixed(0);
	return (
		seconds == 60 ?
		(minutes+1) + ':00' :
		minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
  }