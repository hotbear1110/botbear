require('dotenv').config();

module.exports = (function () {
    const router = require('express').Router();
    
    /* /resolved */
    router.get('/', async (req, res) => {
        let state = req.query.state || '';
        
        res.render('resolved', state);
    });

    return router;
})();