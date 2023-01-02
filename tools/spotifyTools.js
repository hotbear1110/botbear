const { got } = require('./../got');
const sql = require('../sql/index.js');
require('dotenv').config();

exports.refreshToken = async function(username, refresh_token) {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
	const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

	const spotifyRefresh = await got.post('https://api.spotify.com/v1/me/player', {
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
        },
        form: {
            'grant_type': 'refresh_token',
            refresh_token: refresh_token
        }
    }).json();

    const new_access_token = spotifyRefresh.access_token;

    await sql.Query('UPDATE Spotify SET access_token = ? WHERE username = ?',
        [new_access_token, username]);

    const spotifyData = await got('https://accounts.spotify.com/api/token', {
        headers: {
            'Authorization': 'Bearer ' + new_access_token,
            'Content-Type': 'application/json'
        }
    }).json();

    return spotifyData;
};