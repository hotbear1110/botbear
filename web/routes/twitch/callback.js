require('dotenv').config();
const querystring = require('querystring');
const { got } = require('../../../got');

module.exports = (function () {
    const sql = require('../../../sql/index.js');
    const router = require('express').Router();

    const client_id = process.env.TWITCH_CLIENTID;

    /* /Callback */
    router.get('/', async (req, res) => {
        let auth = res.access_token;
        let state = req.query.state || null;

        console.log(res);
      return router;

         if (state) {
          let authOptions = {
            url: 'https://api.twitch.tv/helix/users?id=141981764',
            headers: {
              'Authorization': 'Bearer ' + auth,
              'Client-Id': client_id
            }
          };

          const twitchRequest = await got.post(authOptions.url, {
						headers: authOptions.headers,
            form: authOptions.form,
					}).json();


        const current_state = await sql.Query('SELECT state FROM Spotify WHERE refresh_token = ?'[spotifyToken.refresh_token]);

        if (current_state) {
          await sql.Query('UPDATE Spotify SET  access_token = ?, expires_in = ? WHERE state = ? ', [spotifyToken.access_token, expires_in, current_state]);
          state = current_state;
        } else {
          await sql.Query(`INSERT INTO Spotify 
        			(state, access_token, refresh_token, expires_in) 
            			values 
        			(?, ?, ?, ?)`,
				[state, spotifyToken.access_token, spotifyToken.refresh_token, expires_in]
				);
        }

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
