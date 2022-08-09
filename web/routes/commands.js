module.exports = (function () {
    const sql = require('../../sql/index.js');
    const router = require('express').Router();
    
    router.get('/', async (req, res) => {
        const commandlist = await sql.Query('SELECT * FROM Commands');

        let categorylist = [];

        for (const command of commandlist) {
            if (!categorylist.includes(command.Category)) {
                categorylist.push(command.Category);
            }
        }

        categorylist = [categorylist[2], categorylist[3], categorylist[1], categorylist[0], categorylist[4]];

        res.render('commands', { commands: commandlist, categories: categorylist });
    });

    return router;
})();
