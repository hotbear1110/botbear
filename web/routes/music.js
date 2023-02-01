require('dotenv').config();

module.exports = (function () {
    const router = require('express').Router();
    
    /* /resolved */
    router.get('/', async (req, res) => {
        let cookies = req.cookies || '';
        console.log(req.cookies);
        let cookieToken = cookies.token;
        
        res.render('music', { cookieToken: cookieToken });
    });

    return router;
})();