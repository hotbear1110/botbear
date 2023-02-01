require('dotenv').config();

module.exports = (function () {
    const router = require('express').Router();
    
    /* /resolved */
    router.get('/', async (req, res) => {
        let cookies = req.cookies || '';

        let cookieToken = cookies.cookieToken;
        
        res.render('music', { cookieToken: cookieToken });
    });

    return router;
})();