const tools = require('../../public/js/tools.js');
const express = require('express');
const suggestionRouter = express.Router();

suggestionRouter.get('', async (req, res) => {
    const suggesionList = await tools.query('SELECT * FROM Suggestions');

    res.render('suggestions', { suggesions: suggesionList.reverse() });
});

module.exports = suggestionRouter;