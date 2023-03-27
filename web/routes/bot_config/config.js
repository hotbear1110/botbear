require('dotenv').config();
const router = require('express').Router();
const sql = require('./../../../sql/index.js');

module.exports = (function () {
    router.get('/', async (req, res) => {
        let cookies = req.cookies || '';
        let query = req.query;

        let cookieToken = cookies.token;
  
        /*

        if (cookieToken) {
          const hasToken = await sql.Query('SELECT * FROM bot_config WHERE cookieToken = ?', [cookieToken]);
  
          if (hasToken.length) {
            res.redirect('./access');
            return router;
          }
        }
        */
        res.render('bot_config/config', {query: query, hasToken: false });
    });

    return router;
})();