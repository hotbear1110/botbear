module.exports = (function () {
    const sql = require('../../sql/index.js');
    const router = require('express').Router();

    /* /suggestions */
    router.get('/', async (req, res) => {
        const suggesionList = await sql.Query('SELECT * FROM Suggestions');
    
        res.render('suggestions', { suggesions: suggesionList.reverse() });
    });

    return router;
})();
