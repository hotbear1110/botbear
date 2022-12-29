require('dotenv').config();
const querystring = require('querystring');

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
          var authOptions = {
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

          await sql.Query(`INSERT INTO Spotify 
        			(state, access_token, refresh_token) 
            			values 
        			(?, ?, ?)`,
				[state, authOptions.access_token, authOptions.refresh_token]
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
