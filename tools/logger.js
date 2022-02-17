const tmi = require('tmi.js');
const redis = require('redis');
const login = require('../connect/connect.js').options;
const cc = require("../bot.js").cc;

const redisC = redis.createClient({ legacyMode: true });

redisC.on('connect', function () {
    console.log('Connected!');
});

redisC.connect();

// Create a client with our options
const client = new tmi.client(login);

// Register our event handlers (defined below)
cc.on('message', onMessageHandler);
cc.on('connected', onConnectedHandler);

// Called every time a message comes in
function onMessageHandler(target, context, msg) {
    redisC.get(`LOGS_${target.substring(1)}`, function (err, reply) {
        if (reply) {
            let jsonlength = JSON.parse(reply);
            let name = Object.keys(jsonlength).length;
            let fullmessage = `{
                "channel": "${target}",
                "user": ${JSON.stringify(context)},
                "message": "${msg}",
                "time_sent": ${new Date().getTime()}}`
            jsonlength[name] = JSON.parse(fullmessage)

            redisC.set(`LOGS_${target.substring(1)}`, JSON.stringify(jsonlength));
        } else {
            redisC.set(`LOGS_${target.substring(1)}`, `{
                "0": {
                    "channel": "${target}",
                    "user": ${JSON.stringify(context)},
                    "message": "${msg}",
                    "time_sent": ${new Date().getTime()}
                }
            }`
            );
        }
    });
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}: ${port}`);
}

module.exports = { redisC };
