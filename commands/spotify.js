require('dotenv').config();
const { got } = require('./../got');
const sql = require('./../sql/index.js');
const spotifyTools = require('../tools/spotifyTools.js');
const youtube = require('youtube-search-api');
const { ErrorReply } = require('redis');

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

            const spotify_user = await spotifyTools.fetchToken(uid);

			if (spotify_user.no_auth) {
				return (username === user.username) ? 'You have not authorized with the bot. Please login here: https://hotbear.org/music' : 'That user has not authorized with the bot.';
			}

			switch(input[2]) {
				case 'allow': {
					await sql.Query('UPDATE Spotify SET opt_in = ? WHERE uid = ?', ['true', uid]);
					return (spotify_user.opt_in === 'true') ? 'You have already allowed others to target you with the spotify command. If you wish to revert this do: bb spotify disallow' : 'You have now allowed others to target you with the spotify command. If you wish to revert this do: bb spotify disallow';
				}
				case 'disallow': {
					await sql.Query('UPDATE Spotify SET opt_in = ? WHERE uid = ?', ['false', uid]);
					return (spotify_user.opt_in === 'false') ? 'You have not allowed people to target you with the spotify command. If you wish to allow that do: bb spotify allow' : 'You now no longer allow others to target you with the spotify command. If you wish to allow that again do: bb spotify allow';
				}
			}

			if (spotify_user.opt_in === 'false' && username !== user.username) {
				return 'That user has not allowed others to target them. Ask them to type the command: bb spotify allow';
			}

            const access_token = spotify_user.access_token;
			
			let spotifyData;

			spotifyData = await got('https://api.spotify.com/v1/me/player', {
				throwHttpErrors: false,
				headers: {
					'Authorization': 'Bearer ' + access_token,
					'Content-Type': 'application/json'
				}
			}).json();
			
			if (!spotifyData.is_playing) {
				return 'Nothing is currently playing';
			}

            const progress_ms = spotifyData.progress_ms;
            const duration_ms = spotifyData.item.duration_ms;
            const artist = spotifyData.item.artists[0].name;
            const title = spotifyData.item.name;

			const progress_min_sec = spotifyTools.millisToMinutesAndSeconds(progress_ms);
			const duration_min_sec = spotifyTools.millisToMinutesAndSeconds(duration_ms);


			const yt_link = (await youtube.GetListByKeyword(artist + ' ' + title, false, 1, [{ type: 'music' }])).items[0].id;

			return (username === user.username) ?
					`Currently playing song: ${title} by ${artist} - (${progress_min_sec}/${duration_min_sec}) | Link: youtu.be/${yt_link}` :
					`Currently playing song on ${username}'s spotify: ${title} by ${artist} - (${progress_min_sec}/${duration_min_sec}) | Link: youtu.be/${yt_link}`;
		} catch (err) {
			console.log(err);
			if (err.message.startsWith('RequestError: Unexpected token U in JSON at position 0')) {
				return 'FeelsDankMan I\'m still not verified by spotify, so I can only add spotify "testers" manually via the dev dashboard. If you want to become a "tester" message @hbear___. You will need to provide your Email to get added.';
			}
			return 'FeelsDankMan Error';
		}
	}
};