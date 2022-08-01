const sql = require('../../../sql/index.js');
const express = require('express');
const suggestionRouter = express.Router();

suggestionRouter.get('', async (req, res) => {
    const suggesionList = await sql.Query('SELECT * FROM Suggestions');

    res.render('suggestions', { suggesions: suggesionList.reverse() });
});

module.exports = suggestionRouter;