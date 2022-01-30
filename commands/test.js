const shell = require("child_process")
const tools = require("../tools/tools.js");
const _ = require("underscore");
const { fchown } = require("fs");
const got = require("got");
let messageHandler = require("../tools/messageHandler.js").messageHandler;
//const redisC = require("../tools/logger.js").redisC;

module.exports = {
    name: "test",
    ping: true,
    description: 'This is a dev command for testing purposes',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }/*
            if (input[2]) {
                channel = input[2];
            }
            const gameTimedata = await tools.query(`SELECT * FROM Streamers WHERE username=?`, [channel]);
            if (!gameTimedata[0]) {
                return "That streamer is not in my database";
            }
            let response = ""
            let test = null;

            test = await new Promise(async function (resolve) {
                redisC.get(`LOGS_${channel}`, async function (err, reply) {
                response = JSON.parse(reply)

                let jsonlength = Object.keys(response).length
                let random = Math.floor(Math.random() * ((jsonlength + 1) - 0) + 0).toString();
                console.log(random.toString())
                let message = response[random]

                const ms = new Date().getTime() - message.time_sent;

                resolve(`Random message from database: ${message.channel} ${message.user.username}: ${message["message"]} - (${tools.humanizeDuration(ms)} ago)`);
            })
        })
*/
            return;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Test Failed`;
        }
    }
}
