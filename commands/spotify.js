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

			let username = user.username;
			let uid = user['user-id'];

			if (input[2]) {
				username = (input[2][0] === '@') ? input[2].replace('@', '').toLowerCase() : username;
				uid = (input[2][0] === '@') ? (await sql.Query('SELECT uid FROM Users WHERE username = ?',[input[2].replace('@', '').toLowerCase()]))[0]?.uid : user['user-id'];
			}

            const spotify_user = await sql.Query('SELECT * FROM Spotify WHERE uid = ?',[uid]);

			if (!spotify_user.length) {
				return (username === user.username) ? 'You have not authorized with the bot. Please login here: https://hotbear.org/login' : 'That user has not authorized with the bot.';
			}

			switch(input[2]) {
				case 'allow': {
					await sql.Query('UPDATE Spotify SET opt_in = ? WHERE username = ?', ['true', username]);
					return (spotify_user[0].opt_in === 'true') ? 'You have already allowed others to target you with the spotify command. If you wish to revert this do: bb spotify disallow' : 'You have now allowed others to target you with the spotify command. If you wish to revert this do: bb spotify disallow';
				}
				case 'disallow': {
					await sql.Query('UPDATE Spotify SET opt_in = ? WHERE username = ?', ['false', username]);
					return (spotify_user[0].opt_in === 'false') ? 'You have not allowed people to target you with the spotify command. If you wish to allow that do: bb spotify allow' : 'You now no longer allow others to target you with the spotify command. If you wish to allow that again do: bb spotify allow';
				}
			}

			if (spotify_user[0].opt_in === 'false' && username !== user.username) {
				return 'That user has not allowed others to target them. Tell them to do: bb spotify allow';
			}

            let access_token = spotify_user[0].access_token;
            const refresh_token = spotify_user[0].refresh_token;
			const expires_in = spotify_user[0].expires_in;
			
			let spotifyData;

			if(Date.now() > expires_in) {
				access_token = await spotifyTools.refreshToken(username, refresh_token);
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
				return 'Nothing is currently playing';
			}

            const progress_ms = spotifyData.progress_ms;
            const duration_ms = spotifyData.item.duration_ms;
            const artist = spotifyData.item.artists[0].name;
            const title = spotifyData.item.name;

			const progress_min_sec = millisToMinutesAndSeconds(progress_ms);
			const duration_min_sec = millisToMinutesAndSeconds(duration_ms);

			return (username === user.username) ?
					`Currently playing song: ${title} by ${artist} - Progress ${progress_min_sec}/${duration_min_sec}` :
					`Currently playing song on ${username}'s spotify: ${title} by ${artist} - Progress ${progress_min_sec}/${duration_min_sec}`;
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