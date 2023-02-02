require('dotenv').config();
const router = require('express').Router();

module.exports = (function () {
    router.get('/', async (req, res) => {
                res.render('resolved');
    });

    return router;
})();