const { got } = require('./../got');
const sql = require('./../sql/index.js');

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

            const access_token = spotify_user[0].access_token;

            const spotifyData = await got('https://api.spotify.com/v1/me/player', {
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                }
            }).json();

            console.log(spotifyData);

            const progress_ms = spotifyData.progress_ms;
            const duration_ms = spotifyData.item.duration_ms;
            const artist = spotifyData.item.artists[0].name;
            const title = spotifyData.item.name;

			return `Currently playing on Spotify: ${title}, by ${artist}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};