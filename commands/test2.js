const tools = require("../tools/tools.js");
const cc = require("../bot.js").cc;
require('dotenv').config();
const got = require("got");

module.exports = {
    name: "test2",
    ping: true,
    description: 'test',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let allsubs = [];
            let haspagnation = true;
            let pagnation = "";
            while (haspagnation) {
                let subs = await got(`https://api.twitch.tv/helix/eventsub/subscriptions?after=${pagnation}`, {
                    headers: {
                        'client-id': process.env.TWITCH_CLIENTID,
                        'Authorization': process.env.TWITCH_AUTH
                    }
                });
                subs = JSON.parse(subs.body);
                if (subs.pagination.cursor) {
                    pagnation = subs.pagination.cursor;
                } else {
                    haspagnation = false;
                }
                subs = subs.data;
                allsubs = allsubs.concat(subs)
            }

            console.log(allsubs.length)
            let realsubs = allsubs.filter(x => x.condition.broadcaster_user_id === "135186096");
            console.log(realsubs)
            return;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}