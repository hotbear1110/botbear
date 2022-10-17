const Markov = require('markov-strings').default;
const redisC = require('../tools/markovLogger.js').redisC;
const tools = require('../tools/tools.js');

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
            this.channel = input.filter(x => x.startsWith('channel:'))[0]?.split(':')[1] ?? channel;
            input = input.filter(x  => x !== `channel:${this.channel}`);
            let msg = input.join(' ');

            console.log(msg);
            let result = await new Promise(async (resolve) => {  await redisC.get(`Markov:${this.channel}`, async function (err, reply) {
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

                resolve(await this.result);

            } catch(err) {
                console.log(err);
                resolve({ string: 'Failed to generate markov string' });
            }
            }); 
        });
        console.log(await result);

        this.pings = await tools.masspingString(result.string, channel);
        await this.pings.map(x => result.string = result.string.replaceAll(/test/gi, tools.unpingUser(x)));

        console.log(result.string);
        if (await result.string.match(/[&|$|/|.|?|-]|\bkb\b|^\bmelon\b/g) && !msg.match(/^[./]me /)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
            result.string = '. ' + result.string.charAt(0) + '\u{E0000}' + result.string.substring(1);
        }
        if (await result.string?.match(/^!/g)) {
            result.string = '❗ ' + result.string.substring(1);
        }
            return await result.string;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};