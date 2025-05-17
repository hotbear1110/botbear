module.exports = (function () {
    const router = require('express').Router();
    
    router.get('/', async (req, res) => {
        res.render('success');
    });

    return router;
})();
