const { got } = require('./../got');
const sql = require('../sql/index.js');
require('dotenv').config();
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

exports.refreshToken = async function(uid, refresh_token) {

        let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            refresh_token: refresh_token,
            grant_type: 'refresh_token',
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

	const spotifyRefresh = await got.post(authOptions.url, {
        headers: authOptions.headers,
        form: authOptions.form
    }).json();

    console.log(spotifyRefresh);

    const new_access_token = spotifyRefresh.access_token;

    const expires_in = Date.now() + spotifyRefresh.expires_in * 1000;

    await sql.Query('UPDATE Spotify SET access_token = ?, expires_in = ? WHERE uid = ?',
        [new_access_token, expires_in, uid]);

    return new_access_token;
};

exports.fetchToken = async function(uid) {
    const spotify_user = await sql.Query('SELECT * FROM Spotify WHERE uid = ?',[uid]);

    if (!spotify_user.length){
        return { no_auth: true };
    }

    let access_token = spotify_user[0].access_token;
    const refresh_token = spotify_user[0].refresh_token;
    const expires_in = spotify_user[0].expires_in;

	if(Date.now() > expires_in) {
        try {
            access_token = await this.refreshToken(uid, refresh_token);
        } catch (err) {
            console.log(err);
            return { error: 'Failed to refresh token' };
        }
	}

    return { opt_in: spotify_user[0].opt_in, access_token: access_token };

};

exports.millisToMinutesAndSeconds = function(ms) {
	let minutes = Math.floor(ms / 60000);
	let seconds = ((ms % 60000) / 1000).toFixed(0);
	return (
		seconds == 60 ?
		(minutes+1) + ':00' :
		minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
  };