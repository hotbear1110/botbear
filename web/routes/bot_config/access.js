require('dotenv').config();
const router = require('express').Router();
const sql = require('./../../sql/index.js');

module.exports = (function () {
    router.get('/', async (req, res) => {
        let cookies = req.cookies || '';
        let query = req.query;

        let cookieToken = cookies.token;


        if (cookieToken) {
          const hasToken = await sql.Query('SELECT * FROM Spotify WHERE cookieToken = ?', [cookieToken]);
  
          if (hasToken.length) {
            res.redirect('./config');
            return router;
          }
        }

        // Add someting for query ?error=access_denied and ?error=api_error

        res.render('access', {query: query });
    });

    return router;
})();