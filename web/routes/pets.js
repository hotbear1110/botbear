module.exports = (function () {
    const router = require('express').Router();
    const sql = require('./../../sql/index.js');

    /* /suggestions */
    router.get('/', async (req, res) => {
        let pets = await sql.Query('SELECT * FROM Yabbe_pet',);

        res.render('pets', { pets: pets});
    });

    return router;
})();