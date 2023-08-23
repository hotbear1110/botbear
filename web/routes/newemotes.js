module.exports = (function () {
    const router = require('express').Router();
    const { got } = require('./../../got');

    /* /suggestions */
    router.get('/', async (req, res) => {
        let emotes = [];
        let hasPage = true;
        let page = 1;

        await new Promise(async function (resolve) {
            while(hasPage) {
                const currentPage = await got(`https://bot-api.gempir.com/api/emotelog?channel=nymn&limit=100&page=${page}`).json();
                if (!currentPage.length) {
                    resolve(emotes);
                    hasPage = false;
                }
                emotes = emotes.concat(currentPage);
                page++;
            }
        });

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
                EmoteCode: 'VeryClean',
                EmoteID: '63f2440c3ebf15a76f4f07e9',
                AddedBy: 'ludias',
                Type: 'election',
                CreatedAt: '2023-01-24T00:00:00.000000Z'
            },
            {
                EmoteCode: 'DOCBOZO',
                EmoteID: '63f25606bb16b52ef4a0d27f',
                AddedBy: 'alex_illustration',
                Type: 'election',
                CreatedAt: '2023-01-16T00:00:00.000000Z'
            },
            {
                EmoteCode: 'heCrazy',
                EmoteID: '63f27b343b0894cb3bf5c950',
                AddedBy: 'ludias',
                Type: 'election',
                CreatedAt: '2023-01-17T00:00:00.000000Z'
            },
            {
                EmoteCode: 'FeelsWeakMan',
                EmoteID: '63f2806d08f5788b589253c7',
                AddedBy: 'tolatos',
                Type: 'election',
                CreatedAt: '2023-01-26T00:00:00.000000Z'
            },
            {
                EmoteCode: 'batJAM',
                EmoteID: '63f3697e0588a70e9a8d1f6f',
                AddedBy: 'bankxs__',
                Type: 'election',
                CreatedAt: '2023-02-06T00:00:00.000000Z'
            },
            {
                EmoteCode: 'pepeMeltdown',
                EmoteID: '609eebd34c18609a1d984f3f',
                AddedBy: 'mrastor',
                Type: 'election',
                CreatedAt: '2023-02-19T00:00:00.000000Z'
            },
            {
                EmoteCode: '!join',
                EmoteID: '63e79f39743d199fec640849',
                AddedBy: 'socialiststar',
                Type: 'election',
                CreatedAt: '2023-02-10T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Madge',
                EmoteID: '60ae99233c27a8b79c7fcb73',
                AddedBy: 'hey_bgood',
                Type: 'election',
                CreatedAt: '2023-02-04T00:00:00.000000Z'
            },
            {
                EmoteCode: 'HandsUp',
                EmoteID: '619209bc17e4d50afc0d9619',
                AddedBy: 'marrryanx',
                Type: 'election',
                CreatedAt: '2023-01-27T00:00:00.000000Z'
            },
            {
                EmoteCode: 'forsenGa',
                EmoteID: '61a7c0e5e9684edbbc37d13a',
                AddedBy: 'agenttud',
                Type: 'election',
                CreatedAt: '2023-01-20T00:00:00.000000Z'
            },
            {
                EmoteCode: 'TriKool',
                EmoteID: '635206405029098c3d6e1c6c',
                AddedBy: 'vlashaaak',
                Type: 'election',
                CreatedAt: '2023-01-20T00:00:00.000000Z'
            },
            {
                EmoteCode: 'forsenCoomer',
                EmoteID: '60aed84b423a803ccafdd4b4',
                AddedBy: 'maxthurian',
                Type: 'election',
                CreatedAt: '2023-01-20T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Susge',
                EmoteID: '611a4f329fa9a9dd99b69750',
                AddedBy: 'bankxs__',
                Type: 'election',
                CreatedAt: '2023-01-19T00:00:00.000000Z'
            },
            {
                EmoteCode: 'dankHug',
                EmoteID: '616edc115ff09767de29919b',
                AddedBy: 'hotbear1110',
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
                EmoteID: '63f3c388face0f3bbeaad1d1',
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
                EmoteCode: 'MEMONEYING',
                EmoteID: '63fa2b0117478c0c59fc73c1',
                AddedBy: 'MODS',
                CreatedAt: '2023-02-25T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Fridge',
                EmoteID: '61fc0f1123f0a55b0ba8313d',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-24T00:00:00.000000Z'
            },
            {
                EmoteCode: 'ApolloWake',
                EmoteID: '616ee25bb6d21adaffbe9177',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-23T00:00:00.000000Z'
            },
            {
                EmoteCode: '(Wednesday day off)',
                EmoteID: '',
                AddedBy: '(Wednesday day off)',
                CreatedAt: '2023-02-22T00:00:00.000000Z'
            },
            {
                EmoteCode: 'catKISS',
                EmoteID: '60a1babb3c3362f9a4b8b33a',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-21T00:00:00.000000Z'
            },
            {
                EmoteCode: 'PokerFace',
                EmoteID: '60ef515648cde2fcc3c699da',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-20T00:00:00.000000Z'
            },
            {
                EmoteCode: 'silly',
                EmoteID: '627580419a4c13e9457927c3',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-19T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Rime',
                EmoteID: '61e32b713441abfa431ca77c',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-18T00:00:00.000000Z'
            },
            {
                EmoteCode: 'gekPls',
                EmoteID: '60ccd826197108c5ca4c1169',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-17T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Donkborne',
                EmoteID: '63b70f6dc57736fec02f900c',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-16T00:00:00.000000Z'
            },
            {
                EmoteCode: 'pepeJAM',
                EmoteID: '6040a8bccf6746000db10348',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-15T00:00:00.000000Z'
            },
            {
                EmoteCode: '(Birthday day off)',
                EmoteID: '',
                AddedBy: '(Birthday day off)',
                CreatedAt: '2023-02-14T00:00:00.000000Z'
            },
            {
                EmoteCode: 'batDisco',
                EmoteID: '63f28aebf2915b442ca80ce5',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-13T00:00:00.000000Z'
            },
            {
                EmoteCode: 'SoyScream',
                EmoteID: '60ae745fdc23eca68e4e0a3d',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-12T00:00:00.000000Z'
            },
            {
                EmoteCode: 'TAUNTED',
                EmoteID: '63ebd1953eab12f5199c044a',
                AddedBy: 'MODS',
                CreatedAt: '2023-02-11T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Ratge',
                EmoteID: '60ba145c31abfff37bd0d280',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-10T00:00:00.000000Z'
            },
            {
                EmoteCode: 'headBang',
                EmoteID: '60ae4f175d3fdae583148348',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-09T00:00:00.000000Z'
            },
            {
                EmoteCode: '(Wednesday day off)',
                EmoteID: '',
                AddedBy: '(Wednesday day off)',
                CreatedAt: '2023-02-08T00:00:00.000000Z'
            },
            {
                EmoteCode: 'peepoPog',
                EmoteID: '60afa6b412f90fadd60a7d9b',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-07T00:00:00.000000Z'
            },
            {
                EmoteCode: 'MeowwartsSchool',
                EmoteID: '6237279d73f35ccbda40a64e',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-06T00:00:00.000000Z'
            },
            {
                EmoteCode: 'peepoTalk',
                EmoteID: '62f9c8cf00630d5b2acd66d1',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-05T00:00:00.000000Z'
            },
            {
                EmoteCode: 'XiJinNymN',
                EmoteID: '611687c2446a415801b1b55c',
                AddedBy: 'MODS',
                CreatedAt: '2023-02-04T00:00:00.000000Z'
            },
            {
                EmoteCode: 'DonkDriving',
                EmoteID: '610ff4353f3e99ddb4628023',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-03T00:00:00.000000Z'
            },
            {
                EmoteCode: 'coupleofidiots',
                EmoteID: '634379257361e04bb26bdb49',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-02T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Cooking',
                EmoteID: '61a91b7315b3ff4a5bb8e72b/',
                AddedBy: 'NymN',
                CreatedAt: '2023-02-01T00:00:00.000000Z'
            },
            {
                EmoteCode: 'AREYOUAGIRL',
                EmoteID: '60cfa860ca263e7ca4de398a',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-31T00:00:00.000000Z'
            },
            {
                EmoteCode: '4Love',
                EmoteID: '60db66aa9a9fbb6acd8351c1',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-30T00:00:00.000000Z'
            },
            {
                EmoteCode: '4WeirdBusiness',
                EmoteID: '60ae84eb4b1ea4526d5bc117',
                AddedBy: 'MODS',
                CreatedAt: '2023-01-29T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Vacatime',
                EmoteID: '62dbd0fa0a430aad0143c1f4',
                AddedBy: 'MODS',
                CreatedAt: '2023-01-28T00:00:00.000000Z'
            },
            {
                EmoteCode: 'bruhSit',
                EmoteID: '611c6818c7e1fe52005c1371',
                AddedBy: 'MODS',
                CreatedAt: '2023-01-27T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Gondola2',
                EmoteID: '60af206912d77014919c5ba6',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-26T00:00:00.000000Z'
            },
            {
                EmoteCode: '(Wednesday day off)',
                EmoteID: '',
                AddedBy: '(Wednesday day off)',
                CreatedAt: '2023-01-25T00:00:00.000000Z'
            },
            {
                EmoteCode: 'meow',
                EmoteID: '6210799f238beda80c09cfb8',
                AddedBy: 'NymN (fawcan)',
                CreatedAt: '2023-01-24T00:00:00.000000Z'
            },
            {
                EmoteCode: 'peepoPizza',
                EmoteID: '60b0e3cb7500a64f7c0ba32d',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-23T00:00:00.000000Z'
            },
            {
                EmoteCode: 'parasocial',
                EmoteID: '626bac5655df243a4fa819cd',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-22T00:00:00.000000Z'
            },
            {
                EmoteCode: 'KKrikey',
                EmoteID: '603ea168284626000d068881',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-21T00:00:00.000000Z'
            },
            {
                EmoteCode: 'lookUp',
                EmoteID: '637ce74f58f8ed425904bd51',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-20T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Okayge',
                EmoteID: '60e7328e484ebd628b556b3e',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-19T00:00:00.000000Z'
            },
            {
                EmoteCode: 'Wheel',
                EmoteID: '60db33899a9fbb6acd26b151',
                AddedBy: 'MODS',
                CreatedAt: '2023-01-18T00:00:00.000000Z'
            },
            {
                EmoteCode: 'FeelsLagMan',
                EmoteID: '60afcde452a13d1adba73d29',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-17T00:00:00.000000Z'
            },
            {
                EmoteCode: 'HEWILLNEVER',
                EmoteID: '60b6e6d45d373afbd69c2d45',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-16T00:00:00.000000Z'
            },
            {
                EmoteCode: 'PirateJam',
                EmoteID: '61485c0e1eb7078240526fd9',
                AddedBy: 'NymN',
                CreatedAt: '2023-01-15T00:00:00.000000Z'
            },
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
                EmoteCode: 'PotFaint',
                EmoteID: '62ac06d1604faf8634221574',
                AddedBy: 'Ligos96',
                CreatedAt: '2023-01-20T00:00:00.000000Z'
            },
            {
                EmoteCode: 'walterSmile',
                EmoteID: '60fdd36e5ab6dc5bc4b1a7f8',
                AddedBy: 'southbye',
                CreatedAt: '2023-01-19T00:00:00.000000Z'
            },
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
                EmoteID: '63f36852f2915b442ca820ad',
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
