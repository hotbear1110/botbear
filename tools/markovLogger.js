
const redis = require('redis');
const cc = require('../bot.js').cc;

const redisC = redis.createClient({ url: process.env.REDIS_ADDRESS, legacyMode: true });

redisC.on('connect', function () {
	console.log('Connected!');
});

redisC.connect();

// Register our event handlers (defined below)
cc.on('message', onMessageHandler);

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
	if (self) {
		return;
	}
	redisC.get(`Markov:${target.substring(1)}`, function (err, reply) {

		if (reply && reply !== undefined) {
			reply = JSON.parse(reply);

			reply.push(msg);
			if (reply.length > 1000) {
				reply.splice(0, reply.length - 999);
			}
			let send = JSON.stringify(reply);

			redisC.set(`Markov:${target.substring(1)}`, send);
		} else {
			let send = JSON.stringify([msg]);
			redisC.set(`Markov:${target.substring(1)}`, send);
		}
	});
}


module.exports = { redisC };
