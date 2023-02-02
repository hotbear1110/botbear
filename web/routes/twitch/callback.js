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

        if (req.query.error === 'access_denied') {
          res.redirect('../music?' + querystring.stringify(req.query));
          return router;
        }

         if (state) {
          let userAuthOptions = {
            url: 'https://id.twitch.tv/oauth2/token?',
            params: querystring.stringify({
              client_id: client_id,
              client_secret: client_secret,
              code: code,
              grant_type: 'authorization_code',
              redirect_uri: 'https://hotbear.org/twitch/callback'
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
        const hasID = await sql.Query('SELECT * FROM Spotify WHERE uid = ?', [twitchRequest.data[0].id]);
        
        if (hasID.length) {
          let cookieToken = generateRandomString(255);
          res.cookie('token', cookieToken, {maxAge: 60 * 60 * 24 * 7, /* 1 week */});


          await sql.Query('UPDATE Spotify SET  cookieToken = ? WHERE uid = ? ', [cookieToken, twitchRequest.data[0].id]);

          res.redirect('../music');
          return router;
        }

        let cookieToken = generateRandomString(255);
        res.cookie('token', cookieToken, {maxAge: 60 * 60 * 24 * 7, /* 1 week */});


          await sql.Query(`INSERT INTO Spotify 
        			(uid, username, cookieToken) 
            			values 
        			(?, ?, ?)`,
				[twitchRequest.data[0].id, twitchRequest.data[0].login, cookieToken]
				);

        res.redirect('../music');

        } else {
            res.redirect('/#' +
            querystring.stringify({
              error: 'state_mismatch'
            }));        }
    });

    return router;
})();

const generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};