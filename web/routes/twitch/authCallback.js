require('dotenv').config();
const querystring = require('querystring');
const { got } = require('../../../got');

module.exports = (function () {
    const sql = require('../../../sql/index.js');
    const router = require('express').Router();

    const client_id = process.env.TWITCH_CLIENTID;
    const client_secret = process.env.TWITCH_SECRET;

    /* /Callback */
    router.get('/', async (req, res) => {
        let code = req.query.code;
        let state = req.query.state || null;


         if (state) {
          let userAuthOptions = {
            url: 'https://id.twitch.tv/oauth2/token?',
            params: querystring.stringify({
              client_id: client_id,
              client_secret: client_secret,
              code: code,
              grant_type: 'authorization_code',
              redirect_uri: 'https://hotbear.org/twitch/auth/callback'
            })
          };

        
        let userAuth;
        try {
          userAuth = await got.post(userAuthOptions.url + userAuthOptions.params).json();
        } catch (err) {
          console.log(err);
          return router;
        }

        let authOptions = {
            url: 'https://api.twitch.tv/helix/users',
            headers: {
              'Authorization': 'Bearer ' + userAuth.access_token,
              'Client-Id': client_id
            }
          };
  
          let twitchRequest;
  
          try {
  
          twitchRequest = await got(authOptions.url, {
            headers: authOptions.headers,
            form: authOptions.form,
          }).json();
  
        } catch (err) {
          console.log(err);
          return router;
        }


        const hasID = await sql.Query('SELECT * FROM Auth_users WHERE uid = ?', [twitchRequest.data[0].id]);

        const expires_in = Date.now() + userAuth.expires_in;

        if (hasID.length) {
          await sql.Query('UPDATE Auth_users SET access_token = ?, refresh_token = ?, expires_in = ? WHERE uid = ? ', [userAuth.access_token, userAuth.refresh_token, expires_in, twitchRequest.data[0].id]);

          res.redirect('../success');

          return router;
        }

          await sql.Query(`INSERT INTO Auth_users 
        			(uid, access_token, refresh_token, expires_in) 
            			values 
        			(?, ?, ?, ?)`,
				[twitchRequest.data[0].id, userAuth.access_token, userAuth.refresh_token, expires_in]
				);

        res.redirect('../success');

        } else {
            res.redirect('/#' +
            querystring.stringify({
              error: 'state_mismatch'
            }));        }
    });

    return router;
})();