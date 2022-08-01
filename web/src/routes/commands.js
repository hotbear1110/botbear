const tools = require('../../public/js/tools.js');
const express = require('express');
const commandRouter = express.Router();

commandRouter.get('', async (req, res) => {
    const commandlist = await tools.query('SELECT * FROM Commands');

    let categorylist = [];

    for (const command of commandlist) {
        if (!categorylist.includes(command.Category)) {
            categorylist.push(command.Category);
        }
    }

    categorylist = [categorylist[2], categorylist[3], categorylist[1], categorylist[0], categorylist[4]];

    console.log(categorylist);
    res.render('commands', { commands: commandlist, categories: categorylist });
});

module.exports = commandRouter;