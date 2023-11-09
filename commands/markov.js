const Markov = require('markov-strings').default;
const redisC = require('../tools/markovLogger.js').redisC;
const tools = require('../tools/tools.js');
const { got } = require('./../got');
require('dotenv').config();

const MARKOV_URL = 'https://magnolia.melon095.no/api/Markov/';

module.exports = {
	name: 'markov',
	ping: false,
	description: 'Markov',
	permission: 100,
	cooldown: 120, //in seconds
	category: 'Random command',
	opt_outable: false, 
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

            input = input.splice(2);
            const channelName = input.filter(x => x.startsWith('channel:'))[0]?.split(':')[1] ?? channel;

            const channelID = await tools.getUserID(channelName);
            if (!channelID)
            {
                return 'Error: Channel not found';
            }
            input = input.filter(x  => x !== `channel:${channelName}`);

            let msg = input.join(' ');
            let markovStatusCode = 200;
            let markovError = '';
            
            console.log(msg);
            try {
                const searchParams = new URLSearchParams([
                    ['channelID', channelID],
                    ['seed', msg]
                ]);

                const { statusCode, body }  = await got(MARKOV_URL, {
                    searchParams: searchParams,
                    timeout: {
                        request: 3000
                    },
                    throwHttpErrors: false
                });

                const response = JSON.parse(body);
                console.log(response);

                if (!response.errors) {
                    return `🔖 ${await tools.unpingString(response.message, channel)}`;
                }

                markovStatusCode = statusCode;
                markovError = response.error;
            }
            catch (err) {
                console.log(err);
            }

            const localMarkovData = await redisC.get(`Markov:${channelName.toLowerCase()}`);
            let result;

            try 
            {
                let jsonData = JSON.parse(localMarkovData);
                console.log(jsonData.length);

                const markov = new Markov({ stateSize: 1 });

                markov.addData(jsonData);

                const options = {
                    maxTries: 10000,
                    prng: Math.random,
                    filter: (result) => {return result.score > 5 && result.refs.filter(x => x.string.toLowerCase().includes(msg.toLowerCase())).length > 0 && result.string.split(' ').length >= 10;}
                };

                result = markov.generate(options);
            }
            catch (err)
            {
                console.log(err);
                if (markovStatusCode === 201) {
                    return 'Error: No data from this channel, but it\'s getting logged (if it\'s a real channel).';
                }

                return 'Error: ' + markovError;
            }
            
            console.log(result);


        return `🔖 ${await tools.unpingString(result, channel)}`;

		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
