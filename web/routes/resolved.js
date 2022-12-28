require('dotenv').config();

module.exports = (function () {
    const router = require('express').Router();
    
    /* /resolved */
    router.get('/', async (req, res) => {
        let state = req.query.state || null;
        
        res.render('state', state);
    });

    return router;
})();