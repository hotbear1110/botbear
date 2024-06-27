const Markov = require('markov-strings').default;
const redisC = require('../tools/markovLogger.js').redisC;
const tools = require('../tools/tools.js');
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
            const channelName = input.filter(x => x.startsWith('channel:'))[0]?.split(':')[1] ?? channel;

            const channelID = await tools.getUserID(channelName);
            if (!channelID) {
                return 'Error: Channel not found';
            }
            input = input.filter(x => x !== `channel:${channelName}`);

            let msg = input.join(' ');
            let markovStatusCode = 200;

            console.log(msg);

            let result;

            await redisC.get(`Markov:${channelName.toLowerCase()}`, function (err, reply) {
                console.log(reply)

                let jsonData = JSON.parse(reply);

                console.log(jsonData)

                const markov = new Markov({ stateSize: 1 });

                markov.addData(jsonData);

                const options = {
                    maxTries: 10000,
                    prng: Math.random,
                    filter: (result) => { return result.score > 5 && result.refs.filter(x => x.string.toLowerCase().includes(msg.toLowerCase())).length > 0 && result.string.split(' ').length >= 10; }
                };

                result = markov.generate(options);
            });

            console.log(result);

            return `🔖 ${await tools.unpingString(result, channel)}`;

        } catch (err) {
            console.log(err);
            return 'FeelsDankMan Error';
        }
    }
};
