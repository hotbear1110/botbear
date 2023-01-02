require('dotenv').config();
const querystring = require('querystring');
const { got } = require('../../got');

module.exports = (function () {
    const sql = require('../../sql/index.js');
    const router = require('express').Router();

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = 'https://hotbear.org/callback';

    /* /Callback */
    router.get('/', async (req, res) => {
        let code = req.query.code || null;
        let state = req.query.state || null;
      

         if (state) {
          let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
          };

          const spotifyToken = await got.post(authOptions.url, {
						headers: authOptions.headers,
            form: authOptions.form,
					}).json();

        const expires_in = Date.now() + spotifyToken.expires_in * 1000; 

          await sql.Query(`INSERT INTO Spotify 
        			(state, access_token, refresh_token, expires_in) 
            			values 
        			(?, ?, ?, ?)`,
				[state, spotifyToken.access_token, spotifyToken.refresh_token, expires_in]
				);

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
