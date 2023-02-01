require('dotenv').config();
const querystring = require('querystring');
const { got } = require('../../../got');

module.exports = (function () {
    const sql = require('../../../sql/index.js');
    const router = require('express').Router();

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = 'https://hotbear.org/spotify/callback';

    /* /Callback */
    router.get('/', async (req, res) => {
        let code = req.query.code || null;
        let state = req.query.state || null;
      
        let cookies = req.cookies || '';

        let cookieToken = cookies.token;

        if (!cookieToken) {
          res.redirect('../music');
          return router;
        }

        const hasToken = await sql.Query('SELECT * FROM Spotify WHERE cookieToken = ?', [cookieToken]);

        if (!hasToken.length) {
          res.redirect('../music');
          return router;
        }

         if (state) {
          let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
          };

          const spotifyToken = await got.post(authOptions.url, {
						headers: authOptions.headers,
            form: authOptions.form,
					}).json();

        const expires_in = Date.now() + spotifyToken.expires_in * 1000; 

        await sql.Query('UPDATE Spotify SET  access_token = ?, expires_in = ?, refresh_token = ? WHERE cookieToken = ? ', [spotifyToken.access_token, expires_in, spotifyToken.refresh_token, cookieToken]);


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
