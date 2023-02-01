require('dotenv').config();
const cookie = require('cookie');

module.exports = (function () {
    const router = require('express').Router();
    
    /* /resolved */
    router.get('/', async (req, res) => {
        let cookies = cookie.parse(req.headers.cookie || '');

        let cookieToken = cookies.cookieToken;
        
        res.render('music', { cookieToken: cookieToken });
    });

    return router;
})();