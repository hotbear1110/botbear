const tools = require("../tools/tools.js");
const cc = require("../bot.js").cc;
require('dotenv').config();
const got = require("got");

module.exports = {
    name: "test",
    ping: true,
    description: 'test',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let data = JSON.stringify({
                "type": "stream.online",
                "version": "1",
                "condition": { "broadcaster_user_id": "44445592" },
                "transport": { "method": "webhook", "callback": "https://hotbear.org/eventsub", "secret": process.env.TWITCH_SECRET }
            });
            await got.post(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH,
                    'Content-Type': 'application/json'
                },
                body: data
            });
            return `"${message}"`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}