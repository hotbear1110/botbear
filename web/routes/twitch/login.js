require('dotenv').config();
const querystring = require('querystring');
const cookie = require('cookie');
const sql = require('../../../sql/index.js');

module.exports = (function () {
    const router = require('express').Router();

    const client_id = process.env.TWITCH_CLIENTID;
    const redirect_uri = 'https://hotbear.org/twitch/callback';

    /* /Login */
    router.get('/', async (req, res) => {

      let cookies = cookie.parse(req.headers.cookie || '');

      let cookieToken = cookies.cookieToken;

      if (cookieToken) {
        const hasToken = await sql.Query('SELECT * FROM Spotify WHERE cookieToken = ?', [cookieToken]);

        if (hasToken.length) {
          res.redirect('../music');
          return router;
        }
      }
        let state = generateRandomString(16);
        let scope = '';
      
        res.redirect('https://id.twitch.tv/oauth2/authorize?' +
          querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
          }));
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