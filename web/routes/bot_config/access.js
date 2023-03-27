require('dotenv').config();
const router = require('express').Router();
const sql = require('./../../../sql/index.js');

module.exports = (function () {
    router.get('/', async (req, res) => {
        let cookies = req.cookies || '';
        let query = req.query;

        let cookieToken = cookies.token;

        const hasToken = await sql.Query('SELECT * FROM bot_config WHERE cookieToken = ?', [cookieToken]);

        // Add someting for query ?error=access_denied and ?error=api_error

        res.render('access', {query: query, hasToken: hasToken.length });
    });

    return router;
})();