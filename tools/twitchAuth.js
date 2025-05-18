const { got } = require('./../got');
const sql = require('../sql/index.js');
require('dotenv').config();
const client_id = process.env.TWITCH_CLIENTID;
const client_secret = process.env.TWITCH_SECRET;

exports.refreshToken = async function(uid, refresh_token) {

        let authOptions = {
        url: 'https://id.twitch.tv/oauth2/token',
        form: {
            refresh_token: refresh_token,
            grant_type: 'refresh_token',
            client_secret: client_secret,
            client_id: client_id
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
      };

	const twitchRefresh = await got.post(authOptions.url, {
        headers: authOptions.headers,
        form: authOptions.form
    }).json();

    console.log(twitchRefresh);

    const new_access_token = twitchRefresh.access_token;

    const expires_in = Date.now() + twitchRefresh.expires_in;

    await sql.Query('UPDATE Auth_users SET access_token = ?, expires_in = ? WHERE uid = ?',
        [new_access_token, expires_in, uid]);

    return new_access_token;
};

exports.fetchToken = async function(uid) {
    console.log(uid)
    const twitch_user = await sql.Query('SELECT * FROM Auth_users WHERE uid = ?',[uid]);

    if (!twitch_user.length){
        return { no_auth: true };
    }

    let access_token = twitch_user[0].access_token;
    const refresh_token = twitch_user[0].refresh_token;
    const expires_in = twitch_user[0].expires_in;

	if(Date.now() > expires_in) {
        try {
            access_token = await this.refreshToken(uid, refresh_token);
        } catch (err) {
            console.log(err);
            return { error: 'Failed to refresh token' };
        }
	}

    return { access_token: access_token };

};