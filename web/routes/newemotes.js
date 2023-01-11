module.exports = (function () {
    const router = require('express').Router();
    const { got } = require('./../../got');

    /* /suggestions */
    router.get('/', async (req, res) => {
        let emotes = await got('https://bot-api.gempir.com/api/emotelog?channel=nymn&limit=1000').json();

        emotes.push({ 
            EmoteCode: 'AlienPls',
            EmoteID: '60e8677677b18d5dd3800410',
            AddedBy: 'kurrekts',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'DOCING',
            EmoteID: '603cd0152c7b4500143b46db',
            AddedBy: 'soaral',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'NymN',
            EmoteID: '60ae546c9986a00349ea35d5',
            AddedBy: 'cycionetm',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'Clueless',
            EmoteID: '6154ecd36251d7e000db18a0',
            AddedBy: 'cycionetm',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'Aware',
            EmoteID: '6145e8b10969108b671957ec',
            AddedBy: 'cybo_',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'LULE',
            EmoteID: '605305868c870a000de38b6f',
            AddedBy: 'dagaugl',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'Cat',
            EmoteID: '60b5917d22b0373436c28ac0',
            AddedBy: 'fawcan',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'nymn123',
            EmoteID: '6162d21ef7b7a929341244dd',
            AddedBy: 'aiterace',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'pokiDance',
            EmoteID: '60a1de4aac2bcb20efc751fb',
            AddedBy: 'gempir',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'POGPLANT',
            EmoteID: '60b4fd124eb0019aa6ed4ec7',
            AddedBy: 'fawcan',
            Type: 'election'
         });

         emotes.push({ 
            EmoteCode: 'PagMan',
            EmoteID: '60ae9a57ac03cad60771b2d8',
            AddedBy: 'gempir',
            Type: 'election'
         });
    
        res.render('newemotes', { emotes: emotes });
    });

    return router;
})();