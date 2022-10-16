const Markov = require('markov-strings').default;
const redisC = require('../tools/markovLogger.js').redisC;

module.exports = {
	name: 'markov',
	ping: false,
	description: 'Markov',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command',
	opt_outable: false, 
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            input = input.splice(2);
			let msg = input.join(' ');
            console.log(msg);
            let result = new Promise(async (resolve) => {  await redisC.get(`Markov:${channel}`, async function (err, reply) {
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

                result = markov.generate(options);

                resolve(await result);

            } catch(err) {
                resolve('Failed to generate markov string');
            }
            }); 
        });
        if (result.string?.match(/[&|$|/|.|?|-]|\bkb\b|^\bmelon\b/g) && !msg.match(/^[./]me /)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
            result.string = '. ' + result.string.charAt(0) + '\u{E0000}' + result.string.substring(1);
        }
        if (result.string?.match(/^!/g)) {
            result.string = '❗ ' + result.string.substring(1);
        }
            console.log(await result);
            return await result.string ?? result;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};