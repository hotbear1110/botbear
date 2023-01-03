module.exports = (function () {
    const sql = require('../../sql/index.js');
    const router = require('express').Router();

    /* /suggestions */
    router.get('/', async (req, res) => {
        const suggestionList = await sql.Query('SELECT * FROM Suggestions');
    
        res.render('suggestions', { suggestions: suggestionList.reverse() });
    });

    return router;
})();
