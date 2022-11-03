const Markov = require('markov-strings').default;
const redisC = require('../tools/markovLogger.js').redisC;
const tools = require('../tools/tools.js');
const { got } = require('./../got');
require('dotenv').config();

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
            this.channel = input.filter(x => x.startsWith('channel:'))[0]?.split(':')[1] ?? channel;
            input = input.filter(x  => x !== `channel:${this.channel}`);
            let msg = input.join(' ');
            let markovAPI;
            
            console.log(msg);
            try {
                markovAPI = await got(`https://magnolia.melon095.live/api/markov?channel=${this.channel}&seed=${encodeURIComponent(msg)}`, { throwHttpErrors: false, timeout: {
                    request: 3000
                } }).json();
            } catch (err) {
                console.log(err);
                markovAPI = null;
            }
            
            let result =  await markovAPI?.data?.markov;
            if (await markovAPI === null || !await markovAPI?.success) {
                result = await new Promise(async (resolve) => {  await redisC.get(`Markov:${this.channel.toLowerCase()}`, async function (err, reply) {
                    try {
                    let data = JSON.parse(reply);
                        console.log(data.length);
                    const markov = new Markov({ stateSize: 1 });
    
                    
                        markov.addData(data);
                    
                    const options = {
                        maxTries: 10000,
                        prng: Math.random,
                        filter: (result) => {return result.score > 5 && result.refs.filter(x => x.string.toLowerCase().includes(msg.toLowerCase())).length > 0 && result.string.split(' ').length >= 10;}
                      };
    
                    this.result = markov.generate(options);
    
                    resolve(this.result.string);
    
                } catch(err) {
                    console.log(err);
                    resolve('Failed to generate markov string');
                }
                }); 
            });
            }
            
        console.log(await result);

        result = await tools.unpingString(result, channel);

        return '🔖 '  + await result;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
