module.exports = (function () {
    const router = require('express').Router();
    
    router.get('/', async (req, res) => {
        res.render('commands');
    });

    return router;
})();
