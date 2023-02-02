require('dotenv').config();
const router = require('express').Router();
const sql = require('../../../sql/index.js');

module.exports = (function () {
    router.get('/', async (req, res) => {
        let state = req.query.state || '';

        const hasState = (await sql.Query('SELECT * FROM Spotify WHERE state = ?', [state])).length;

        res.render('resolved', { hasState: hasState });
    });

    return router;
})();