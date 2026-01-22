module.exports = (function () {
    const router = require('express').Router();
    const sql = require('../../sql/index.js');

    /* /suggestions */
    router.get('/(:page)?', async (req, res) => {
        let pets = await sql.Query('SELECT * FROM nymn_pet',);

        let perPage = 20;
        let page = req.params.page || 1;

        let count = pets.length;
    
        pets = pets.slice((perPage * page) - perPage, perPage * page);

        res.render('nymn_pets', {
            pets: pets,
            current: page,
            pages: Math.ceil(count / perPage)
        });
    });

    return router;
})();