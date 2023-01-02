const { got } = require('./../got');
const sql = require('../sql/index.js');
require('dotenv').config();

exports.refreshToken = async function(username, refresh_token) {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

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

    await sql.Query('UPDATE Spotify SET access_token = ?, expires_in = ? WHERE username = ?',
        [new_access_token, expires_in, username]);

    return new_access_token;
};