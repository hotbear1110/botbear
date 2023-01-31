require('dotenv').config();
const querystring = require('querystring');
const { got } = require('../../../got');

module.exports = (function () {
    const sql = require('../../../sql/index.js');
    const router = require('express').Router();

    const client_id = process.env.TWITCH_CLIENTID;

    /* /Callback */
    router.get('/', async (req, res) => {
        let code = res.query.code;
        let state = req.query.state || null;

        console.log(res);
      return router;

         if (state) {
          let userAuthOptions = {
            url: 'https://id.twitch.tv/oauth2/token',
            params: querystring.stringify({
              client_id: client_id,
              client_secret: client_secret,
              code: code,
              grant_type: 'authorization_code',
              redirect_uri: 'https://hotbear.org/twitch/callback'
            })
          };

        const userAuth = await got.post(userAuthOptions.url + userAuthOptions.params).json();

        let authOptions = {
          url: 'https://api.twitch.tv/helix/users',
          headers: {
            'Authorization': 'Bearer ' + userAuth.access_token,
            'Client-Id': client_id
          }
        };

        const twitchRequest = await got.post(authOptions.url, {
          headers: authOptions.headers,
          form: authOptions.form,
        }).json();

          await sql.Query(`INSERT INTO Spotify 
        			(state, uid, username) 
            			values 
        			(?, ?, ?)`,
				[state, twitchRequest.data[0].id, twitchRequest.data[0].login]
				);
          state = current_state;

                res.redirect('/resolved?' + 
                querystring.stringify({
                    state: state
                  })
                );
        } else {
            res.redirect('/#' +
            querystring.stringify({
              error: 'state_mismatch'
            }));        }
    });

    return router;
})();
