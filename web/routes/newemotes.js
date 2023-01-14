const { con } = require('../../sql');

module.exports = (function () {
    const router = require('express').Router();
    const { got } = require('./../../got');

    /* /suggestions */
    router.get('/', async (req, res) => {
        let emotes = await got('https://bot-api.gempir.com/api/emotelog?channel=nymn&limit=100').json();

        emotes.push({ 
            EmoteCode: 'AlienPls',
            EmoteID: '60e8677677b18d5dd3800410',
            AddedBy: 'kurrekts',
            Type: 'election',
            CreatedAt: '2023-01-02T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'DOCING',
            EmoteID: '603cd0152c7b4500143b46db',
            AddedBy: 'soaral',
            Type: 'election',
            CreatedAt: '2023-01-02T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'NymN',
            EmoteID: '60ae546c9986a00349ea35d5',
            AddedBy: 'cycionetm',
            Type: 'election',
            CreatedAt: '2023-01-02T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'Clueless',
            EmoteID: '6154ecd36251d7e000db18a0',
            AddedBy: 'cycionetm',
            Type: 'election',
            CreatedAt: '2023-01-01T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'Aware',
            EmoteID: '6145e8b10969108b671957ec',
            AddedBy: 'cybo_',
            Type: 'election',
            CreatedAt: '2023-01-01T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'LULE',
            EmoteID: '605305868c870a000de38b6f',
            AddedBy: 'dagaugl',
            Type: 'election',
            CreatedAt: '2023-01-01T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'Cat',
            EmoteID: '60b5917d22b0373436c28ac0',
            AddedBy: 'fawcan',
            Type: 'election',
            CreatedAt: '2022-12-31T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'nymn123',
            EmoteID: '6162d21ef7b7a929341244dd',
            AddedBy: 'aiterace',
            Type: 'election',
            CreatedAt: '2022-12-31T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'pokiDance',
            EmoteID: '60a1de4aac2bcb20efc751fb',
            AddedBy: 'gempir',
            Type: 'election',
            CreatedAt: '2022-12-31T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'POGPLANT',
            EmoteID: '60b4fd124eb0019aa6ed4ec7',
            AddedBy: 'fawcan',
            Type: 'election',
            CreatedAt: '2022-12-31T00:00:00.000000Z'
         });

         emotes.push({ 
            EmoteCode: 'PagMan',
            EmoteID: '60ae9a57ac03cad60771b2d8',
            AddedBy: 'gempir',
            Type: 'election',
            CreatedAt: '2022-12-31T00:00:00.000000Z'
         });


         const modifyEmotes = [
            {
                EmoteCode: 'dankHug',
                EmoteID: '616edc115ff09767de29919b',
                AddedBy: 'hbear___',
                Type: 'election',
                CreatedAt: '2023-01-06T00:00:00.000000Z'
            },
            {
                EmoteCode: 'docPls',
                EmoteID: '618fd73e17e4d50afc0d4e3f',
                AddedBy: 'ralkur',
                Type: 'election',
                CreatedAt: '2023-01-04T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Sadge',
                EmoteID: '61630205c1ff9a17cc396522',
                AddedBy: 'rexinus1',
                Type: 'election',
                CreatedAt: '2023-01-10T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Pepege',
                EmoteID: '60afc290ebfcf7562ee8bab5',
                AddedBy: 'vlashaaak',
                Type: 'election',
                CreatedAt: '2023-01-11T00:00:00.000000Z'
            },
            {
                EmoteCode: 'docL',
                EmoteID: '6350bab5462cfc442024c27c',
                AddedBy: 'timboooooh',
                Type: 'election',
                CreatedAt: '2023-01-03T00:00:00.000000Z'
            },
            {
                EmoteCode: 'eShrug',
                EmoteID: '61a7bac1e9684edbbc37d009',
                AddedBy: 'wesselch',
                Type: 'election',
                CreatedAt: '2023-01-09T00:00:00.000000Z'
            },
            {
                EmoteCode: 'ok',
                EmoteID: '62af82f5454b0130fba333ba',
                AddedBy: 'tolatos',
                Type: 'election',
                CreatedAt: '2023-01-05T00:00:00.000000Z'
            },
            {
                EmoteCode: 'docLeave',
                EmoteID: '60a7c696928d15c10b4de1d9',
                AddedBy: 'rexinus1',
                Type: 'election',
                CreatedAt: '2023-01-06T00:00:00.000000Z'
            },
         ];


         modifyEmotes.map(x => emotes.splice(emotes.map(y => y.EmoteCode).indexOf(x.EmoteCode), 1, x));


         const nymnEmotes = [
            {
                EmoteCode: 'FeelsNymNge',
                EmoteID: '63c1e2d7182ccc7de666c18b',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-14T00:00:00.000000Z'
            },
            {
                EmoteCode: 'GymN',
                EmoteID: '6305c255d4b348f08e833c90',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-13T00:00:00.000000Z'
            },
            {
                EmoteCode: 'RAGEY',
                EmoteID: '62f80d745a8981e4c792ca1c',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-12T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Excel',
                EmoteID: '61fe824dd771ca5bf0379bb2',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-11T00:00:00.000000Z'
            },
            {
                EmoteCode: 'peepoChat',
                EmoteID: '63438a743d1bc89e0ff9e400',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-10T00:00:00.000000Z'
            },
            {
                EmoteCode: 'veryFors',
                EmoteID: '62af8dd26f979a8714748dd2',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-09T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Buhh',
                EmoteID: '61d679c83d52bb5c33c4f9a6',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-08T00:00:00.000000Z'
            },
            {
                EmoteCode: '(Saturday day off)',
                EmoteID: '',
                AddedBy: '(Saturday day off)',
                CreatedAt: '2023-01-07T00:00:00.000000Z'
            },
            {
                EmoteCode: 'FeelsDonkMan',
                EmoteID: '603cb56bc20d020014423c60',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-06T00:00:00.000000Z'
            },
            {
                EmoteCode: 'SNIFFA',
                EmoteID: '60e787dd375879d78fc6b25e',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-05T00:00:00.000000Z'
            },
            {
                EmoteCode: 'pepeW',
                EmoteID: '63072162942ffb69e13d703f',
                AddedBy: 'MODS',
                CreatedAt: '2023-01-04T00:00:00.000000Z'
            },
            {
                EmoteCode: 'TimeToNime',
                EmoteID: '6329beb61c85cd937753ec61',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-03T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Okayeg',
                EmoteID: '603caa69faf3a00014dff0b1',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-02T00:00:00.000000Z'
            },
            {
                EmoteCode: 'FloppaJAM',
                EmoteID: '60af0116a564afa26e3a7e86',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-01T00:00:00.000000Z'
            }
        ];

        const viewerEmotes = [
            {
                EmoteCode: 'forsenWiggle',
                EmoteID: '618a368217e4d50afc0cb2a8',
                AddedBy: 'G4bben',
                CreatedAt: '2023-01-13T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Ogre',
                EmoteID: '61c71adaef5a587a07458f83',
                AddedBy: 'FabulousPotato69',
                CreatedAt: '2023-01-13T00:00:00.000000Z'
            },
            {
                EmoteCode: 'batPls',
                EmoteID: '610a8aab49dcebc8a3924f42',
                AddedBy: 'FutureNactiveAccount',
                CreatedAt: '2023-01-13T00:00:00.000000Z'
            },
            {
                EmoteCode: 'monkaE',
                EmoteID: '63695fc399efe5867cd0d4a5',
                AddedBy: 'vrethur',
                CreatedAt: '2023-01-13T00:00:00.000000Z'
            },
        ];

        res.render('newemotes', { emotes: emotes, nymnEmotes: nymnEmotes, viewerEmotes: viewerEmotes });
    });

    return router;
})();