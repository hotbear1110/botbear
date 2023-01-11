module.exports = (function () {
    const router = require('express').Router();
    const { got } = require('./../../got');

    /* /suggestions */
    router.get('/', async (req, res) => {
        const emotes = await got('https://bot-api.gempir.com/api/emotelog?channel=nymn&limit=1000').json();
    
        res.render('newemotes', { emotes: emotes });
    });

    return router;
})();