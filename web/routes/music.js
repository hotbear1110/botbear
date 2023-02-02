require('dotenv').config();
const router = require('express').Router();
const sql = require('./../../sql/index.js');
const { got } = require('./../../got');

module.exports = (function () {
    router.get('/', async (req, res) => {
        let cookies = req.cookies || '';
        let query = req.query;

        let cookieToken = cookies.token;

        let userInfo = await sql.Query('SELECT * FROM Spotify WHERE cookieToken = ?', [cookieToken]);

        const hasToken = userInfo.length;

        if (hasToken) {
            userInfo = userInfo[0];
            const [getImage] = await got(`https://api.ivr.fi/v2/twitch/user?id=${userInfo.uid}`).json();
            userInfo['logo'] = getImage.logo;
        }

        res.render('music', { cookieToken: hasToken, userInfo: userInfo, query: query });
    });

    return router;
})();